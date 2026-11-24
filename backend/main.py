from fastapi import FastAPI

app = FastAPI(title="Asha API")


@app.get("/")
def home():
    return {
        "message": "Asha backend is running"
    }