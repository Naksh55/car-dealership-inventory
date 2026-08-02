# Purpose: Creates and configures the FastAPI application and registers API routes.

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine, SessionLocal
from app import models
from app.routes import auth, vehicles

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Car Dealership Inventory System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ],
    allow_origin_regex=r"https://car-dealership-inventory.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(vehicles.router)


@app.on_event("startup")
def promote_configured_admin():
    admin_email = os.environ.get("BOOTSTRAP_ADMIN_EMAIL")
    if not admin_email:
        return
    db = SessionLocal()
    try:
        user = db.query(models.User).filter(models.User.email == admin_email).first()
        if user and not user.is_admin:
            user.is_admin = True
            db.commit()
    finally:
        db.close()