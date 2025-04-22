from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter()

class ColumnInput(BaseModel):
    columns: List[str]

@router.post("/upload-columns")
async def upload_columns(data: ColumnInput):
    file_path = "data/training_data.txt"

    headers = data.columns
    if not headers:
        return {"error": "No column names provided"}

    header_row = "| " + " | ".join(headers) + " |"
    separator = "| " + " | ".join(["---"] * len(headers)) + " |"
    data_row = "| " + " | ".join(["None"] * len(headers)) + " |"

    table = "\n".join(["<!--START_COLUMNS-->", header_row, separator, data_row, "<!--END_COLUMNS-->"]) + "\n"

    # Step 1: Read original content
    with open(file_path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    # Step 2: Inject table at line 20
    lines.insert(19, table)

    # Step 3: Write modified content
    with open(file_path, "w", encoding="utf-8") as f:
        f.writelines(lines)

    return {"message": "Columns injected to trainingdata.txt"}
