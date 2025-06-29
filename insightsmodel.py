import firebase_admin 
from firebase_admin import credentials, firestore
import pandas as pd
import numpy as np
import tensorflow as tf
import tensorflowjs as tfjs
import os
from sklearn.model_selection import train_test_split

cred = credentials.Certificate("firebase-admin-key.json") 
firebase_admin.initialize_app(cred)
db = firestore.client()

def fetch_expenses():
    print("🔄 Fetching expenses from Firestore...")
    expenses_ref = db.collection("expenses")
    docs = expenses_ref.stream()

    data = []
    for doc in docs:
        d = doc.to_dict()
        d['id'] = doc.id
        data.append(d)

    print(f"✅ {len(data)} records fetched")
    return pd.DataFrame(data)

df = fetch_expenses()

print("🧹 Preprocessing...")

required_columns = ['amount', 'participants', 'deadline']
df = df.dropna(subset=required_columns)

df['participant_count'] = df['participants'].apply(lambda x: len(x) if isinstance(x, list) else 0)
df['deadline_month'] = pd.to_datetime(df['deadline'].astype(str), errors='coerce').dt.month.fillna(0)

# Prepare features without category
X = df[['participant_count', 'deadline_month']].values
y = df['amount'].values

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

print("🧠 Training model...")

model = tf.keras.Sequential([
    tf.keras.layers.Dense(32, activation='relu', input_shape=(X.shape[1],)),
    tf.keras.layers.Dense(16, activation='relu'),
    tf.keras.layers.Dense(1)
])

model.compile(optimizer='adam', loss='mse', metrics=['mae'])
model.fit(X_train, y_train, epochs=50, batch_size=32, validation_split=0.1, verbose=1)

EXPORT_DIR = "tfjs_model"
os.makedirs(EXPORT_DIR, exist_ok=True)
tfjs.converters.save_keras_model(model, EXPORT_DIR)

print(f"✅ Model exported to: {EXPORT_DIR}/")
print(f"📦 Upload contents of {EXPORT_DIR}/ to Firebase Hosting, S3, or GitHub Pages.")
