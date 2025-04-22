from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.upload import router as upload_router
from routes.download_csv import router as download_csv_router
from routes.table import router as table_router

app = FastAPI()

# Add CORSMiddleware to allow cross-origin requests from your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins= [
    "http://localhost:5173",  # Local dev frontend
    "https://data-extractor-956v.vercel.app",  # Deployed frontend on Vercel
],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Include the routers
app.include_router(upload_router)
app.include_router(download_csv_router)
app.include_router(table_router)


@app.get("/")
def read_root():
    return {"message": "Backend is running successfully"}