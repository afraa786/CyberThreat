# wichain/dashboard/app.py
import streamlit as st
import pandas as pd
import requests
import json
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta
import time
import os
import logging
from typing import Dict, List, Optional, Any, Tuple

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("wichain_dashboard.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("WiChain-Dashboard")

# Set page config
st.set_page_config(
    page_title="WiFi detection Dashboard",
    page_icon="📶",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Title and description
st.title("Wi-Fi Spoofing Detection Dashboard")
st.markdown("""
This dashboard provides real-time monitoring and detection of Wi-Fi spoofing attacks 
using location-based detection, signal fingerprinting, and machine learning.
""")

# API base URL
API_BASE = "http://localhost:8000/api"

# Sidebar for navigation
st.sidebar.title("Navigation")
page = st.sidebar.radio("Go to", ["Network Detection", "Blockchain Explorer", "System Statistics", "Real-time Monitoring"])

# Add a button to force refresh data
if st.sidebar.button("Force Refresh Data"):
    st.experimental_rerun()

# Add a button to check backend connection
if st.sidebar.button("Check Backend Connection"):
    try:
        response = requests.get(f"{API_BASE}/health", timeout=5)
        if response.status_code == 200:
            st.sidebar.success("✅ Backend connection successful")
        else:
            st.sidebar.error(f"❌ Backend connection failed: {response.status_code}")
    except Exception as e:
        st.sidebar.error(f"❌ Backend connection error: {str(e)}")

# Helper function to make API requests with better error handling
def api_request(endpoint, method="GET", data=None, timeout=10):
    try:
        url = f"{API_BASE}/{endpoint}"
        logger.info(f"Making API request: {method} {url}")
        
        if method == "GET":
            response = requests.get(url, timeout=timeout)
        elif method == "POST":
            response = requests.post(url, json=data, timeout=timeout)
        elif method == "PUT":
            response = requests.put(url, json=data, timeout=timeout)
        
        if response.status_code == 200:
            logger.info(f"API request successful: {url}")
            return response.json()
        else:
            error_msg = f"API Error: {response.status_code} - {response.text}"
            logger.error(error_msg)
            st.error(error_msg)
            return None
    except requests.exceptions.RequestException as e:
        error_msg = f"Connection Error: {e}"
        logger.error(error_msg)
        st.error(error_msg)
        return None
    except json.JSONDecodeError as e:
        error_msg = f"JSON Decode Error: {e}"
        logger.error(error_msg)
        st.error(error_msg)
        return None

# Helper function to extract vendor from MAC address
def get_vendor_from_mac(bssid, vendor_db):
    """Extract vendor from MAC address using the provided vendor database"""
    if not bssid or not isinstance(bssid, str) or not vendor_db:
        return "Unknown"
    
    # Clean the MAC address
    clean_bssid = bssid.replace(':', '').replace('-', '').upper()
    if len(clean_bssid) < 6:
        return "Unknown"
    
    # Get the OUI (first 6 characters)
    oui = clean_bssid[:6]
    
    # Look up vendor in database
    return vendor_db.get(oui, "Unknown")

# Network Detection Page
if page == "Network Detection":
    st.header("Network Detection")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("Manual Network Input")
        with st.form("network_form"):
            ssid = st.text_input("SSID", "Free Public WiFi")
            bssid = st.text_input("BSSID", "12:34:56:78:90:ab")
            signal_strength = st.slider("Signal Strength (dBm)", -100, -30, -75)
            frequency = st.radio("Frequency (GHz)", [2.4, 5.0])
            channel = st.slider("Channel", 1, 165, 6)
            encryption = st.selectbox("Encryption", ["OPEN", "WEP", "WPA", "WPA2", "WPA3"])
            latitude = st.number_input("Latitude", value=19.0760)
            longitude = st.number_input("Longitude", value=72.8777)
            vendor = st.selectbox("Vendor", ["TP-Link", "Netgear", "D-Link", "Cisco", "Unknown", "Rogue"])
            
            submitted = st.form_submit_button("Detect Spoofing")
            
            if submitted:
                network_data = {
                    "ssid": ssid,
                    "bssid": bssid,
                    "signal_strength": signal_strength,
                    "frequency": frequency,
                    "channel": channel,
                    "encryption": encryption,
                    "latitude": latitude,
                    "longitude": longitude,
                    "vendor": vendor
                }
                
                result = api_request("scan", "POST", network_data)
                
                if result:
                    st.subheader("Detection Results")
                    
                    if result['is_spoof']:
                        st.error(f"Spoof Network Detected: {result['ssid']}")
                    else:
                        st.success(f"Legitimate Network: {result['ssid']}")
                    
                    col1, col2 = st.columns(2)
                    with col1:
                        st.metric("ML Confidence", f"{result['ml_confidence']:.2%}")
                    with col2:
                        st.metric("ML Prediction", "Spoof" if result['ml_prediction'] == 1 else "Legitimate")
                    
                    if result['rule_based_reasons']:
                        st.warning("Rule-based Detection Triggers:")
                        for reason in result['rule_based_reasons']:
                            st.write(f"- {reason}")
                    
                    with st.expander("View Features"):
                        st.json(result['features'])
    
    with col2:
        st.subheader("Network Scanner")
        st.info("Click below to scan for nearby Wi-Fi networks")
        
        if st.button("Start Network Scan"):
            with st.spinner("Scanning networks..."):
                result = api_request("scan", "POST")
                if result:
                    st.success("Scan completed! Check the Real-time Monitoring page for results.")
                    st.json(result)
        
        st.subheader("Recent Networks")
        networks = api_request("networks?limit=20")
        
        if networks:
            # Debug info
            with st.expander("Debug Info: Network Data Flow"):
                st.write(f"Number of networks received: {len(networks)}")
                st.write("Sample of received networks:")
                st.json(networks[:3])  # Show first 3 networks for debugging
            
            for network in networks:
                status = "🟢" if not network.get('is_spoof', False) else "🔴"
                ssid = network.get('ssid', 'Hidden Network')
                bssid = network.get('bssid', 'Unknown BSSID')
                signal = network.get('signal_strength', 'N/A')
                vendor = network.get('vendor', 'Unknown')
                
                st.write(f"{status} {ssid} ({bssid}) - {vendor} - {signal}dBm")
        else:
            st.warning("No network data available. Check backend connection.")

# Blockchain Explorer Page
elif page == "Blockchain Explorer":
    st.header("⛓ Blockchain Explorer")
    
    # Get blockchain data
    blocks = api_request("blockchain?limit=50")
    
    if blocks:
        st.subheader(f"Blockchain (Length: {len(blocks)})")
        
        # Display latest blocks
        for block in blocks:
            with st.expander(f"Block #{block['index']} - {block['timestamp']}"):
                col1, col2 = st.columns(2)
                
                with col1:
                    st.write("**Block Hash:**")
                    st.code(block['hash'][:20] + "..." + block['hash'][-20:])
                    
                    st.write("**Previous Hash:**")
                    st.code(block['previous_hash'][:20] + "..." + block['previous_hash'][-20:] if block['previous_hash'] != "0" else "Genesis Block")
                
                with col2:
                    st.write("**Block Data:**")
                    st.json(block['data'])
        
  
        st.subheader("Blockchain Statistics")
        col1, col2, col3 = st.columns(3)
        
        with col1:
            st.metric("Total Blocks", len(blocks))
        
        with col2:
            spoof_count = sum(1 for block in blocks if block['data'].get('is_spoof', False))
            st.metric("Spoof Detections", spoof_count)
        
        with col3:
            latest_block = blocks[0] if blocks else {}
            if latest_block.get('timestamp'):
                block_time = datetime.fromisoformat(latest_block['timestamp'].replace('Z', '+00:00'))
                st.metric("Latest Block", block_time.strftime("%Y-%m-%d %H:%M"))
    
    else:
        st.warning("No blockchain data available")

# System Statistics Page
elif page == "System Statistics":
    st.header("System Statistics")
    
    stats = api_request("stats")
    
    if stats:
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            st.metric("Total Networks", stats['total_networks'])
        
        with col2:
            st.metric("Spoof Networks", stats['spoof_networks'])
        
        with col3:
            st.metric("Legitimate Networks", stats['legitimate_networks'])
        
        with col4:
            st.metric("Spoof Percentage", f"{stats['spoof_percentage']:.1f}%")
        
        # Create charts
        col1, col2 = st.columns(2)
        
        with col1:
            # Networks by encryption type
            networks = api_request("networks?limit=1000")
            if networks:
                df = pd.DataFrame(networks)
                encryption_counts = df['encryption'].value_counts()
                
                fig = px.pie(
                    values=encryption_counts.values,
                    names=encryption_counts.index,
                    title="Networks by Encryption Type"
                )
                st.plotly_chart(fig)
        
        with col2:
            # Signal strength distribution
            if networks:
                fig = px.histogram(
                    df, x='signal_strength', 
                    title="Signal Strength Distribution",
                    labels={'signal_strength': 'Signal Strength (dBm)'}
                )
                st.plotly_chart(fig)
        
        # Spoof networks over time
        st.subheader("Spoof Detection Timeline")
        if networks:
            df['timestamp'] = pd.to_datetime(df['timestamp'])
            df['date'] = df['timestamp'].dt.date
            
            timeline_data = df.groupby(['date', 'is_spoof']).size().unstack(fill_value=0)
            timeline_data['Total'] = timeline_data.sum(axis=1)
            timeline_data['Spoof Ratio'] = timeline_data.get(1, 0) / timeline_data['Total']
            
            fig = px.line(
                timeline_data, y='Spoof Ratio',
                title="Daily Spoof Network Ratio",
                labels={'value': 'Spoof Ratio', 'date': 'Date'}
            )
            st.plotly_chart(fig)

# Real-time Monitoring Page
elif page == "Real-time Monitoring":
    st.header(" Real-time Monitoring")
    
    st.info("This page shows real-time network monitoring data")
    
    # Auto-refresh option
    auto_refresh = st.checkbox("Auto-refresh every 10 seconds", value=False)
    
    if auto_refresh:
        placeholder = st.empty()
        stop_button = st.button("Stop Refresh")
        
        if stop_button:
            auto_refresh = False
            st.experimental_rerun()
        
        for seconds in range(10, 0, -1):
            if not auto_refresh:
                break
                
            with placeholder.container():
                st.write(f"Refreshing in {seconds} seconds...")
                time.sleep(1)
        
        if auto_refresh:
            st.experimental_rerun()
    
    # Get recent networks
    networks = api_request("networks?limit=50")
    
    if networks:
        st.subheader("Recent Network Activity")
        
        # Debug info
        with st.expander("Debug Info: Network Data Flow"):
            st.write(f"Number of networks received: {len(networks)}")
            st.write("Sample of received networks:")
            st.json(networks[:3])  # Show first 3 networks for debugging
            
            # Check for TP-Link devices specifically
            tp_link_devices = [net for net in networks if 'tp-link' in net.get('vendor', '').lower() or 
                              'tp_link' in net.get('vendor', '').lower() or
                              'tplink' in net.get('vendor', '').lower()]
            st.write(f"TP-Link devices found: {len(tp_link_devices)}")
            if tp_link_devices:
                st.json(tp_link_devices)
        
        # Create a map of network locations
        map_data = []
        for network in networks:
            if network.get('latitude') and network.get('longitude'):
                map_data.append({
                    'lat': network['latitude'],
                    'lon': network['longitude'],
                    'ssid': network.get('ssid', 'Unknown'),
                    'is_spoof': network.get('is_spoof', False),
                    'signal': network.get('signal_strength', -75),
                    'vendor': network.get('vendor', 'Unknown')
                })
        
        if map_data:
            df_map = pd.DataFrame(map_data)
            df_map['color'] = df_map['is_spoof'].apply(lambda x: 'red' if x else 'green')
            df_map['size'] = df_map['signal'].apply(lambda x: abs(x) / 10)  # Scale for visibility
            
            st.map(df_map, latitude='lat', longitude='lon', color='color', size='size')
        
        # Network table
        st.subheader("Network Details")
        df = pd.DataFrame(networks)
        
        # Check if timestamp column exists
        if 'timestamp' in df.columns:
            df['timestamp'] = pd.to_datetime(df['timestamp'])
        
        # Format for display
        display_columns = ['ssid', 'bssid', 'signal_strength', 'encryption', 'vendor', 'is_spoof']
        if 'timestamp' in df.columns:
            display_columns.append('timestamp')
            
        display_df = df[display_columns]
        display_df['status'] = display_df['is_spoof'].apply(lambda x: 'Spoof' if x else 'Legitimate')
        
        # Add vendor filtering
        vendors = display_df['vendor'].unique()
        selected_vendor = st.selectbox("Filter by Vendor", ["All"] + list(vendors))
        
        if selected_vendor != "All":
            display_df = display_df[display_df['vendor'] == selected_vendor]
        
        st.dataframe(display_df.style.applymap(
            lambda x: 'background-color: #ffcccc' if x == 'Spoof' else 'background-color: #ccffcc', 
            subset=['status']
        ))
    else:
        st.warning("No network data available. Check backend connection.")

# Footer
st.markdown("---")
st.markdown("Wifi Detection"
" - Combating Wi-Fi spoofing through advanced detection techniques")

# Add a button to retrain the model
if st.sidebar.button("Retrain Model"):
    with st.spinner("Retraining model with latest data..."):
        result = api_request("train", "POST")
        if result:
            st.sidebar.success(result['message'])