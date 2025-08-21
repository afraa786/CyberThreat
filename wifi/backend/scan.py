#!/bin/python3
# WiFi Scanner with API - Requires virtual environment
# Make sure to run as Administrator!

import sys
import os
import ctypes
import subprocess
import re
import requests
import time
import json
from flask import Flask, jsonify, request
from flask_cors import CORS
from threading import Thread, Lock
import logging

# Check if running as administrator, if not, relaunch as admin
def is_admin():
    try:
        return ctypes.windll.shell32.IsUserAnAdmin()
    except:
        return False

if not is_admin():
    print("This script requires administrator privileges to access WiFi hardware.")
    print("Requesting elevation...")
    
    # Re-run with admin rights
    script = os.path.abspath(sys.argv[0])
    params = ' '.join(['"{}"'.format(arg) for arg in sys.argv])
    
    try:
        # Request UAC elevation
        ctypes.windll.shell32.ShellExecuteW(None, "runas", sys.executable, params, None, 1)
        sys.exit(0)
    except Exception as e:
        print("Failed to elevate privileges:", e)
        print("Please right-click and select 'Run as administrator'")
        input("Press Enter to exit...")
        sys.exit(1)

# Now we're running as admin - continue
print("=" * 50)
print("RUNNING WITH ADMINISTRATOR PRIVILEGES")
print("=" * 50)
print()

# Disable Flask logging
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Global variables for sharing data between threads
scan_results = []
harvested_ips = []
blacklist = []
status = "idle"
lock = Lock()
scanning_active = False

# ============ Functions ============

def info(content, bad=False):
    '''
    This prints info to the terminal in a fancy way
    '''
    if not bad:
        print(f'[i] {content}')
    else:
        print(f'[X] {content}')
        
    # Also add to status for frontend
    with lock:
        global status
        status = content

def scan_windows():
    '''
    Windows-compatible WiFi scanning using netsh
    '''
    try:
        info("Scanning for WiFi networks...")
        # Run netsh command to scan for WiFi networks
        result = subprocess.run(['netsh', 'wlan', 'show', 'networks', 'mode=bssid'], 
                              capture_output=True, text=True, timeout=30)
        
        if result.returncode != 0:
            info(f"Scan failed: {result.stderr}", bad=True)
            return []
            
        networks = []
        current_network = {}
        
        # Parse the netsh output
        for line in result.stdout.split('\n'):
            line = line.strip()
            if line.startswith('SSID'):
                if current_network:  # Save previous network
                    networks.append(current_network)
                current_network = {'ssid': line.split(':', 1)[1].strip(), 'security': 'Unknown'}
            elif line.startswith('Authentication'):
                current_network['security'] = line.split(':', 1)[1].strip()
            elif line.startswith('BSSID'):
                current_network['bssid'] = line.split(':', 1)[1].strip()
                
        if current_network:  # Add the last network
            networks.append(current_network)
            
        # Filter for open networks
        open_networks = [net for net in networks if 'Open' in net.get('security', '')]
        
        with lock:
            global scan_results
            scan_results = open_networks
            
        info(f"Found {len(open_networks)} open networks")
        return open_networks
        
    except Exception as e:
        info(f"Scan error: {str(e)}", bad=True)
        return []

def connect_windows(bssid, ssid):
    '''
    Windows-compatible WiFi connection
    '''
    try:
        info(f"Attempting to connect to {ssid}")
        # First, disconnect from any current network
        subprocess.run(['netsh', 'wlan', 'disconnect'], timeout=10)
        time.sleep(2)
        
        # Connect to the open network
        result = subprocess.run(['netsh', 'wlan', 'connect', 'name=', ssid], 
                              capture_output=True, text=True, timeout=30)
                              
        if result.returncode == 0:
            info(f"Connected to {ssid}")
            return True
        else:
            info(f"Connection failed: {result.stderr}", bad=True)
            return False
            
    except Exception as e:
        info(f"Connection error: {str(e)}", bad=True)
        return False

def internet_access():
    '''
    Check if we have internet access
    '''
    try:
        info("Checking internet connection...")
        # Try to ping Google's DNS
        result = subprocess.run(['ping', '-n', '2', '8.8.8.8'], 
                              capture_output=True, text=True, timeout=10)
        return result.returncode == 0
    except:
        return False

def harvest_ip():
    '''
    Get public IP address
    '''
    try:
        info("Harvesting IP address...")
        response = requests.get('https://api.ipify.org', timeout=10)
        if response.status_code == 200:
            ip = response.text.strip()
            info(f"Harvested IP: {ip}")
            return ip
    except Exception as e:
        info(f"IP harvest failed: {str(e)}", bad=True)
    
    return 'err'

def in_blacklist(bssid):
    '''
    Check if BSSID is in blacklist
    '''
    with lock:
        return bssid in blacklist

def add_to_blacklist(bssid):
    '''
    Add BSSID to blacklist
    '''
    with lock:
        if bssid not in blacklist:
            blacklist.append(bssid)
            info(f"Added {bssid} to blacklist", bad=True)

def save_ip(ip):
    '''
    Save IP to file
    '''
    try:
        with open('ips.txt', 'a') as f:
            f.write(ip + '\n')
            
        with lock:
            if ip not in harvested_ips:
                harvested_ips.append(ip)
                
        info(f"Saved IP: {ip}")
    except Exception as e:
        info(f"Save error: {str(e)}", bad=True)

def scanning_loop(wait_time=3):
    '''
    Main scanning loop
    '''
    global scanning_active
    iteration = 0
    
    scanning_active = True
    
    while scanning_active:
        info(f"Scanning iteration {iteration}")
        
        # Scan for networks
        networks = scan_windows()
        
        if not networks:
            info("No open networks found", bad=True)
            time.sleep(wait_time)
            iteration += 1
            continue
            
        # Try to connect to each open network
        for network in networks:
            if not scanning_active:
                break
                
            bssid = network.get('bssid', '')
            ssid = network.get('ssid', '')
            
            if not bssid or in_blacklist(bssid):
                continue
                
            info(f"Trying to connect to {ssid} ({bssid})")
            
            if connect_windows(bssid, ssid) and internet_access():
                ip = harvest_ip()
                if ip != 'err':
                    save_ip(ip)
                else:
                    add_to_blacklist(bssid)
            else:
                add_to_blacklist(bssid)
                
            # Brief pause between connection attempts
            time.sleep(2)
            
        time.sleep(wait_time)
        iteration += 1
        
    info("Scanning stopped")

# ============ API Endpoints ============

@app.route('/api/status', methods=['GET'])
def get_status():
    with lock:
        return jsonify({
            'status': status,
            'scan_results': scan_results,
            'harvested_ips': harvested_ips,
            'blacklist': blacklist,
            'scanning_active': scanning_active
        })

@app.route('/api/start', methods=['POST'])
def start_scan():
    data = request.get_json()
    wait_time = data.get('wait_time', 3) if data else 3
    
    # Start scanning in a separate thread if not already running
    with lock:
        global scanning_active
        if not scanning_active:
            scanning_active = True
            thread = Thread(target=scanning_loop, args=(wait_time,), daemon=True)
            thread.start()
            return jsonify({'message': 'Scanning started', 'wait_time': wait_time})
        else:
            return jsonify({'message': 'Already scanning'})

@app.route('/api/stop', methods=['POST'])
def stop_scan():
    with lock:
        global scanning_active
        scanning_active = False
    return jsonify({'message': 'Scanning stopped'})

@app.route('/api/export', methods=['GET'])
def export_data():
    with lock:
        return jsonify({
            'harvested_ips': harvested_ips,
            'scan_history': scan_results
        })

@app.route('/')
def index():
    return '''
    <html>
        <head>
            <title>WiFi Scanner API</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; }
                .container { max-width: 800px; margin: 0 auto; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>WiFi Scanner API</h1>
                <p>Backend is running successfully!</p>
                <p>Endpoints:</p>
                <ul>
                    <li><a href="/api/status">GET /api/status</a> - Get current status</li>
                    <li>POST /api/start - Start scanning</li>
                    <li>POST /api/stop - Stop scanning</li>
                    <li><a href="/api/export">GET /api/export</a> - Export data</li>
                </ul>
            </div>
        </body>
    </html>
    '''

# ============ Main Execution ============

if __name__ == '__main__':
    # Check if running on Windows
    if not sys.platform.startswith('win'):
        info("This modified version is designed for Windows", bad=True)
        sys.exit(1)
        
    info("Starting WiFi Scanner API Server")
    info("API will be available at: http://localhost:5000")
    info("Endpoints:")
    info("  GET  /api/status   - Get current status and data")
    info("  POST /api/start    - Start scanning (JSON: {'wait_time': 3})")
    info("  POST /api/stop     - Stop scanning")
    info("  GET  /api/export   - Export harvested data")
    info("  GET  /             - Web interface")
    
    # Start the Flask API server
    try:
        app.run(host='0.0.0.0', port=5000, debug=False, threaded=True)
    except Exception as e:
        info(f"Failed to start server: {e}", bad=True)
        info("Maybe port 5000 is already in use?", bad=True)