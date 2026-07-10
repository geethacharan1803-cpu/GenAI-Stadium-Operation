import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from main import app # Ensure 'app' is imported from your main file

client = TestClient(app)

def test_analyze_crowd_success():
    """Test valid CSV upload with mocked AI response."""
    with patch("main.genai.GenerativeModel") as mock_model:
        # Mocking the AI response structure
        mock_instance = mock_model.return_value
        mock_instance.generate_content.return_value.text = """
        {
            "recommendation": "Redirect to Gate B",
            "logic_chain": "Gate A at 95% capacity.",
            "projected_impact": "Flow improvement",
            "risk_level": "HIGH"
        }
        """
        
        response = client.post("/analyze-crowd", files={"file": ("test.csv", b"gate_id,capacity\n1,100")})
        assert response.status_code == 200
        data = response.json()
        assert "recommendation" in data
        assert data["risk_level"] == "HIGH"

def test_analyze_crowd_empty_file():
    """Test that empty files return a 400 error."""
    response = client.post("/analyze-crowd", files={"file": ("empty.csv", b"")})
    assert response.status_code == 400

def test_analyze_crowd_malformed_data():
    """Test that malformed data returns a 400 error."""
    response = client.post("/analyze-crowd", files={"file": ("test.csv", b"not,a,csv\nformat")})
    assert response.status_code == 400

def test_ai_failure_handling():
    """Test how the app handles an AI service exception."""
    with patch("main.genai.GenerativeModel") as mock_model:
        mock_instance = mock_model.return_value
        mock_instance.generate_content.side_effect = Exception("API Error")
        
        response = client.post("/analyze-crowd", files={"file": ("test.csv", b"gate_id,capacity\n1,100")})
        # If your code handles errors, it should return 500 or a custom error code
        assert response.status_code in [500, 400]
