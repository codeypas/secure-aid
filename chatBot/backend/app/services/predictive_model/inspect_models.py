import pickle
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "ml_models")

def check_pickle(file):
    path = os.path.join(MODEL_DIR, file)
    try:
        with open(path, "rb") as f:
            obj = pickle.load(f)
            print(f"\n✅ {file} loaded successfully. Type: {type(obj)}")
            if hasattr(obj, 'summary'):
                print(obj.summary())
            elif isinstance(obj, dict):
                print("Keys:", list(obj.keys()))
            elif isinstance(obj, list):
                print(f"List length: {len(obj)}")
            else:
                print("Preview:", str(obj)[:300])
    except Exception as e:
        print(f"❌ Failed to load {file}: {e}")

if __name__ == "__main__":
    print("\n🔍 Inspecting Pickle Files in 'ml_models'...")
    for file in os.listdir(MODEL_DIR):
        if file.endswith(".pkl"):
            check_pickle(file)

