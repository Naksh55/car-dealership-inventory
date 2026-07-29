def test_register_new_user_succeeds(client):
    response = client.post(
        "/api/auth/register",
        json={"email": "test@example.com", "password": "securepass123"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
    assert "id" in data
    assert "hashed_password" not in data


def test_register_duplicate_email_fails(client):
    client.post(
        "/api/auth/register",
        json={"email": "dup@example.com", "password": "securepass123"},
    )
    response = client.post(
        "/api/auth/register",
        json={"email": "dup@example.com", "password": "anotherpass456"},
    )
    assert response.status_code == 400


def test_login_with_correct_credentials_returns_token(client):
    client.post(
        "/api/auth/register",
        json={"email": "login@example.com", "password": "correctpass"},
    )
    response = client.post(
        "/api/auth/login",
        json={"email": "login@example.com", "password": "correctpass"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_with_wrong_password_fails(client):
    client.post(
        "/api/auth/register",
        json={"email": "wrongpass@example.com", "password": "correctpass"},
    )
    response = client.post(
        "/api/auth/login",
        json={"email": "wrongpass@example.com", "password": "wrongpass"},
    )
    assert response.status_code == 401
