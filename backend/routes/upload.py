from typing import List
from fastapi import APIRouter, UploadFile, File, HTTPException
import os
from extractor import process_and_extract_data

router = APIRouter()

UPLOAD_DIR = "./pdfs3"
TRAINING_DATA_FILE = "data/training_data.txt"

@router.post("/upload-pdf/")
async def upload_pdfs(files: List[UploadFile] = File(...)):
    file_paths = []

    # Process files and save them to the server
    for file in files:
        if not file.filename.endswith(".pdf"):
            raise HTTPException(status_code=400, detail=f"{file.filename} is not a PDF")

        os.makedirs(UPLOAD_DIR, exist_ok=True)

        file_location = os.path.normpath(os.path.join(UPLOAD_DIR, file.filename))

        with open(file_location, "wb") as f:
            f.write(await file.read())

        file_paths.append(file_location)

    # Process and extract data from the uploaded PDFs
    try:
        process_and_extract_data(file_paths)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing files: {e}")
    
    # Delete the files after extraction
    for file_path in file_paths:
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
            else:
                raise FileNotFoundError(f"File {file_path} not found.")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error deleting file {file_path}: {str(e)}")

    # Step to delete columns from trainingdata.txt after processing
    try:
        with open(TRAINING_DATA_FILE, "r", encoding="utf-8") as f:
            content = f.read()

        start_tag = "<!--START_COLUMNS-->"
        end_tag = "<!--END_COLUMNS-->"
        if start_tag in content and end_tag in content:
            start_index = content.index(start_tag)
            end_index = content.index(end_tag) + len(end_tag)
            # Remove the block with columns from the trainingdata.txt
            content = content[:start_index] + content[end_index:]
            
            # Write the updated content back to the file
            with open(TRAINING_DATA_FILE, "w", encoding="utf-8") as f:
                f.write(content)
        else:
            raise Exception("No columns found to remove in trainingdata.txt")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting columns from trainingdata.txt: {e}")

    return {"message": f"{len(file_paths)} file(s) processed, and columns removed from trainingdata.txt successfully"}
