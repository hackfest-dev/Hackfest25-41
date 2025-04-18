import os
import sys
import textwrap
import time

def clear_screen():
    """Clear the terminal screen."""
    os.system('cls' if os.name == 'nt' else 'clear')

def read_brochure(file_path):
    """Read the content of the brochure file."""
    with open(file_path, 'r', encoding='utf-8') as f:
        return f.read()
    
