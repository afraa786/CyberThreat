# wichain/setup.py
import os
import subprocess
import sys
from pathlib import Path

def install_requirements():
    """Install required packages"""
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Requirements installed successfully")
    except subprocess.CalledProcessError:
        print("❌ Failed to install requirements")

def create_directories():
    """Create necessary directories"""
    directories = [
        "data/raw",
        "data/processed",
        "model",
        "backend",
        "dashboard",
        "blockchain",
        "utils"
    ]
    
    for directory in directories:
        os.makedirs(directory, exist_ok=True)
        print(f"✅ Created directory: {directory}")

def generate_sample_data():
    """Generate sample data for testing"""
    from utils.data_loader import DataLoader
    
    loader = DataLoader()
    sample_data = loader.generate_sample_data(1000, "data/raw/sample_data.csv")
    print("✅ Generated sample data")

def init_database():
    """Initialize databases"""
    from backend.models import init_db
    init_db()
    print("✅ Databases initialized")

def main():
    """Main setup function"""
    print("🚀 Setting up WiChain system...")
    
    # Create directories
    create_directories()
    
    # Install requirements
    install_requirements()
    
    # Initialize database
    init_database()
    
    # Generate sample data
    generate_sample_data()
    
    print("\n✅ Setup completed successfully!")
    print("\nTo run the system:")
    print("1. Start the API: python backend/main.py")
    print("2. Start the dashboard: streamlit run dashboard/app.py")
    print("3. Test the system: python mvp_wichain.py")

if __name__ == "__main__":
    main()