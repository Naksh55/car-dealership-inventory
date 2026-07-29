import pytest


def register_and_login(client, email="user@example.com", password="pass12345"):
    client.post("/api/auth/register", json={"email": email, "password": password})
    resp = client.post("/api/auth/login", json={"email": email, "password": password})
    return resp.json()["access_token"]


def make_admin(client, db_session_email="admin@example.com", password="adminpass1"):
    # Registers a normal user, then we promote via direct DB access in the fixture below.
    client.post("/api/auth/register", json={"email": db_session_email, "password": password})


@pytest.fixture()
def auth_headers(client):
    token = register_and_login(client)
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture()
def admin_headers(client, db):
    from app import models
    client.post("/api/auth/register", json={"email": "admin@example.com", "password": "adminpass1"})
    user = db.query(models.User).filter(models.User.email == "admin@example.com").first()
    user.is_admin = True
    db.commit()
    resp = client.post("/api/auth/login", json={"email": "admin@example.com", "password": "adminpass1"})
    token = resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_add_vehicle_requires_auth(client):
    response = client.post("/api/vehicles", json={
        "make": "Toyota", "model": "Camry", "category": "Sedan", "price": 25000, "quantity": 5
    })
    assert response.status_code in (401, 403)


def test_add_vehicle_with_auth_succeeds(client, auth_headers):
    response = client.post("/api/vehicles", json={
        "make": "Toyota", "model": "Camry", "category": "Sedan", "price": 25000, "quantity": 5
    }, headers=auth_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["make"] == "Toyota"
    assert "id" in data


def test_list_vehicles(client, auth_headers):
    client.post("/api/vehicles", json={
        "make": "Honda", "model": "Civic", "category": "Sedan", "price": 22000, "quantity": 3
    }, headers=auth_headers)
    response = client.get("/api/vehicles", headers=auth_headers)
    assert response.status_code == 200
    assert len(response.json()) >= 1


def test_search_vehicles_by_make(client, auth_headers):
    client.post("/api/vehicles", json={
        "make": "Ford", "model": "Mustang", "category": "Coupe", "price": 35000, "quantity": 2
    }, headers=auth_headers)
    response = client.get("/api/vehicles/search?make=Ford", headers=auth_headers)
    assert response.status_code == 200
    results = response.json()
    assert all(v["make"] == "Ford" for v in results)
    assert len(results) >= 1


def test_update_vehicle(client, auth_headers):
    create = client.post("/api/vehicles", json={
        "make": "Mazda", "model": "3", "category": "Hatchback", "price": 20000, "quantity": 4
    }, headers=auth_headers)
    vehicle_id = create.json()["id"]
    response = client.put(f"/api/vehicles/{vehicle_id}", json={
        "make": "Mazda", "model": "3", "category": "Hatchback", "price": 19000, "quantity": 4
    }, headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["price"] == 19000


def test_delete_vehicle_requires_admin(client, auth_headers):
    create = client.post("/api/vehicles", json={
        "make": "Kia", "model": "Soul", "category": "SUV", "price": 18000, "quantity": 1
    }, headers=auth_headers)
    vehicle_id = create.json()["id"]
    response = client.delete(f"/api/vehicles/{vehicle_id}", headers=auth_headers)
    assert response.status_code == 403


def test_delete_vehicle_as_admin_succeeds(client, admin_headers):
    create = client.post("/api/vehicles", json={
        "make": "Kia", "model": "Sportage", "category": "SUV", "price": 27000, "quantity": 1
    }, headers=admin_headers)
    vehicle_id = create.json()["id"]
    response = client.delete(f"/api/vehicles/{vehicle_id}", headers=admin_headers)
    assert response.status_code == 204


def test_purchase_decreases_quantity(client, auth_headers):
    create = client.post("/api/vehicles", json={
        "make": "Nissan", "model": "Altima", "category": "Sedan", "price": 24000, "quantity": 2
    }, headers=auth_headers)
    vehicle_id = create.json()["id"]
    response = client.post(f"/api/vehicles/{vehicle_id}/purchase", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["quantity"] == 1


def test_purchase_blocked_at_zero_stock(client, auth_headers):
    create = client.post("/api/vehicles", json={
        "make": "Subaru", "model": "Outback", "category": "SUV", "price": 29000, "quantity": 0
    }, headers=auth_headers)
    vehicle_id = create.json()["id"]
    response = client.post(f"/api/vehicles/{vehicle_id}/purchase", headers=auth_headers)
    assert response.status_code == 400


def test_restock_requires_admin(client, auth_headers):
    create = client.post("/api/vehicles", json={
        "make": "Hyundai", "model": "Elantra", "category": "Sedan", "price": 21000, "quantity": 1
    }, headers=auth_headers)
    vehicle_id = create.json()["id"]
    response = client.post(f"/api/vehicles/{vehicle_id}/restock", json={"amount": 5}, headers=auth_headers)
    assert response.status_code == 403


def test_restock_as_admin_increases_quantity(client, admin_headers):
    create = client.post("/api/vehicles", json={
        "make": "Chevrolet", "model": "Malibu", "category": "Sedan", "price": 23000, "quantity": 1
    }, headers=admin_headers)
    vehicle_id = create.json()["id"]
    response = client.post(f"/api/vehicles/{vehicle_id}/restock", json={"amount": 5}, headers=admin_headers)
    assert response.status_code == 200
    assert response.json()["quantity"] == 6
