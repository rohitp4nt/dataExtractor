from fastapi import APIRouter, BackgroundTasks, Response
from fastapi.responses import FileResponse
import os
import csv

router = APIRouter()

CSV_PATH = "outputs/main.csv"  # Adjust to your file location

# Function to clear the CSV after download
def clear_csv_file():
    with open(CSV_PATH, "w", newline="") as f:
        writer = csv.writer(f)
        # Optionally write headers here if needed
        pass

@router.get("/download-csv/")
async def download_csv(background_tasks: BackgroundTasks):
    if os.path.exists(CSV_PATH):
        # Create FileResponse and return the file to the user
        response = FileResponse(
            path=CSV_PATH,
            filename="extracted_data.csv",
            media_type="text/csv",
        )

        # Add task to clear the CSV after response is sent
        background_tasks.add_task(clear_csv_file)

        return response

    return Response(content="CSV not found", status_code=404)
