def test_health_check_endpoint(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "service" in data
    assert "version" in data
    assert data["database"] == "healthy"
    assert "supported_parsers" in data
    assert "pdf" in data["supported_parsers"]
    assert "docx" in data["supported_parsers"]
    assert "csv" in data["supported_parsers"]
    assert "json" in data["supported_parsers"]
    assert "xlsx" in data["supported_parsers"]
    assert "txt" in data["supported_parsers"]


def test_root_endpoint(client):
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert data["docs_url"] == "/docs"
