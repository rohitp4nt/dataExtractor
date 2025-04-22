# backend/extractor.py

import os
import fitz  # PyMuPDF
import csv
import re
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Normalize species names for consistency
def normalize_species_name(name):
    return re.sub(r"\(.*?\)|[^\w\s.-]", "", str(name)).strip().lower()


def extract_and_chunk_pdf(file_path, chunk_size=5000, overlap=500):
    print(f"Extracting text from: {file_path}")
    doc = fitz.open(file_path)
    text = ""
    for page in doc:
        text += page.get_text("text") + "\n"
    doc.close()

    chunks = []
    for i in range(0, len(text), chunk_size - overlap):
        chunks.append(text[i:i + chunk_size])

    print(f"Total text length: {len(text)} characters")
    print(f"Number of chunks: {len(chunks)}")
    return chunks, text


def convert_md_to_csv(md_content, csv_file, ref_id, existing_species):
    headers = []
    rows = []
    lines = md_content.strip().splitlines()
    if not lines:
        return

    headers = [header.strip() for header in lines[0].strip().split('|') if header]
    headers.insert(0, 'Reference_ID')

    print(f"Processing AI response for Reference ID: {ref_id}")
    for line in lines[2:]:
        row = [value.strip() for value in line.strip().split('|') if value]
        if row:
            row.insert(0, ref_id)
            species_name = normalize_species_name(row[1])

            if species_name not in existing_species:
                existing_species.add(species_name)
                rows.append(tuple(row))
            else:
                print(f"Duplicate species skipped: {species_name} (Ref ID: {ref_id})")

    output_path = os.path.join("outputs", "main.csv")
    os.makedirs("outputs", exist_ok=True)

    with open(output_path, mode='a', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        if file.tell() == 0:
            writer.writerow(headers)
        writer.writerows(rows)


def process_and_extract_data(pdf_files):
    with open("./data/training_data.txt", "r", encoding="utf-8") as f:
        context = f.read()
    print("API KEY:", os.getenv("GEMINI_API_KEY"))  # Just to test if it's loading properly

    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    # genai.configure(api_key="AIzaS0WHM2vqAAURjprBqDxN7R2pWXF1vhJA")

    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        generation_config={"temperature": 0.7, "top_p": 0.9, "max_output_tokens": 8192}
    )

    for pdf in pdf_files:
        ref_id = str(pdf).replace(".pdf", "")
        file_path = f"./{pdf}"
        print(f"\n=== Processing PDF: {pdf} with Reference ID: {ref_id} ===")

        chunks, _ = extract_and_chunk_pdf(file_path)
        previous_chunk = ""
        existing_species = set()

        for idx, chunk in enumerate(chunks):
            print(f"\nProcessing chunk {idx+1}/{len(chunks)} for {ref_id}...")

            combined_chunk = previous_chunk + chunk
            response = model.generate_content([
                context,
                f"Extract only species-related data directly found in the following text. "
                f"Do not add fabricated or unrelated information:\n{combined_chunk}",
                "output: "
            ])

            if not response.text.strip():
                print(f"Skipping empty response for Chunk {idx+1} (Ref ID: {ref_id}).")
                continue

            print(f"Response for Chunk {idx+1} (Ref ID: {ref_id}): {response.text[:100]}...")
            convert_md_to_csv(response.text, "outputs/main.csv", ref_id, existing_species)

            previous_chunk = chunk

        print(f"Finished processing {ref_id}\n")

    print("All PDFs processed successfully.")



# import os
# import fitz  # PyMuPDF
# import csv
# import re
# import google.generativeai as genai
# from dotenv import load_dotenv
# import time

# load_dotenv()

# # Load all API keys from the .env file
# API_KEYS = os.getenv("GEMINI_API_KEYS", "").split(",")  # Comma-separated keys
# api_index = 0  # Start with the first key

# def switch_to_next_api():
#     global api_index
#     api_index = (api_index + 1) % len(API_KEYS)
#     genai.configure(api_key=API_KEYS[api_index])
#     print(f"🔄 Switched to API Key #{api_index + 1}")

# # Initial API setup
# if not API_KEYS or API_KEYS[0] == "":
#     raise Exception("❌ No API keys found in .env. Please add GEMINI_API_KEYS.")

# genai.configure(api_key=API_KEYS[api_index])
# print(f"✅ Using API Key #{api_index + 1}")

# # Normalize species names for consistency
# def normalize_species_name(name):
#     return re.sub(r"\(.*?\)|[^\w\s.-]", "", str(name)).strip().lower()

# def extract_and_chunk_pdf(file_path, chunk_size=5000, overlap=500):
#     print(f"📄 Extracting text from: {file_path}")
#     doc = fitz.open(file_path)
#     text = ""
#     for page in doc:
#         text += page.get_text("text") + "\n"
#     doc.close()

#     chunks = []
#     for i in range(0, len(text), chunk_size - overlap):
#         chunks.append(text[i:i + chunk_size])

#     print(f"📝 Total text length: {len(text)} characters")
#     print(f"🔖 Number of chunks: {len(chunks)}")
#     return chunks, text

# def convert_md_to_csv(md_content, csv_file, ref_id, existing_species):
#     headers = []
#     rows = []
#     lines = md_content.strip().splitlines()
#     if not lines:
#         return

#     headers = [header.strip() for header in lines[0].strip().split('|') if header]
#     headers.insert(0, 'Reference_ID')

#     print(f"📥 Processing AI response for Reference ID: {ref_id}")
#     for line in lines[2:]:
#         row = [value.strip() for value in line.strip().split('|') if value]
#         if row:
#             row.insert(0, ref_id)
#             species_name = normalize_species_name(row[1])

#             if species_name not in existing_species:
#                 existing_species.add(species_name)
#                 rows.append(tuple(row))
#             else:
#                 print(f"⚠️ Duplicate species skipped: {species_name} (Ref ID: {ref_id})")

#     output_path = os.path.join("outputs", "main.csv")
#     os.makedirs("outputs", exist_ok=True)

#     with open(output_path, mode='a', newline='', encoding='utf-8') as file:
#         writer = csv.writer(file)
#         if file.tell() == 0:
#             writer.writerow(headers)
#         writer.writerows(rows)

# def safe_generate_content(model, prompt_parts):
#     attempts = 0
#     while attempts < len(API_KEYS):
#         try:
#             return model.generate_content(prompt_parts)
#         except Exception as e:
#             print(f"❌ Error with API Key #{api_index + 1}: {e}")
#             attempts += 1
#             switch_to_next_api()
#             model = genai.GenerativeModel(
#                 model_name="gemini-1.5-flash",
#                 generation_config={"temperature": 0.7, "top_p": 0.9, "max_output_tokens": 8192}
#             )
#             time.sleep(1)
#     raise Exception("🚨 All API keys exhausted or failed.")

# def process_and_extract_data(pdf_files):
#     with open("./data/training_data.txt", "r", encoding="utf-8") as f:
#         context = f.read()

#     model = genai.GenerativeModel(
#         model_name="gemini-1.5-flash",
#         generation_config={"temperature": 0.7, "top_p": 0.9, "max_output_tokens": 8192}
#     )

#     for pdf in pdf_files:
#         ref_id = str(pdf).replace(".pdf", "")
#         file_path = f"./{pdf}"
#         print(f"\n🚀 Processing PDF: {pdf} with Reference ID: {ref_id}")

#         chunks, _ = extract_and_chunk_pdf(file_path)
#         previous_chunk = ""
#         existing_species = set()

#         for idx, chunk in enumerate(chunks):
#             print(f"\n📦 Chunk {idx+1}/{len(chunks)} for {ref_id}...")

#             combined_chunk = previous_chunk + chunk
#             prompt = [
#                 context,
#                 f"Extract only species-related data directly found in the following text. "
#                 f"Do not add fabricated or unrelated information:\n{combined_chunk}",
#                 "output: "
#             ]

#             response = safe_generate_content(model, prompt)

#             if not response.text.strip():
#                 print(f"⚠️ Empty response for Chunk {idx+1} (Ref ID: {ref_id})")
#                 continue

#             print(f"✅ Got response for Chunk {idx+1} (Ref ID: {ref_id}): {response.text[:100]}...")
#             convert_md_to_csv(response.text, "outputs/main.csv", ref_id, existing_species)

#             previous_chunk = chunk

#         print(f"✅ Finished processing {ref_id}\n")

#     print("🎉 All PDFs processed successfully.")
