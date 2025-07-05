<<<<<<< HEAD
import firebase_admin
from firebase_admin import credentials, firestore
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import os
os.environ["TF_USE_LEGACY_KERAS"] = "1"
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Input
import tensorflowjs as tfjs

# 1. Initialize Firebase Admin SDK (make sure you have your key JSON)
cred = credentials.Certificate("/Users/chellu/OweNus/owetest-edfc7-firebase-adminsdk-fbsvc-58cbd12368.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# 2. Fetch expenses data from Firestore
def fetch_expenses():
    docs = db.collection('expenses').stream()
    data = []
    for doc in docs:
        d = doc.to_dict()
        participants = d.get('participants', [])
        # Use number of participants as numeric feature
        num_participants = len(participants) if isinstance(participants, list) else 0

        # If deadline_month is stored as a datetime, extract month; else default 0
        deadline = d.get('deadline')
        if hasattr(deadline, 'month'):
            deadline_month = deadline.month
        else:
            deadline_month = 0

        amount = d.get('amount', 0)
        # Make sure amount is float
        try:
            amount = float(amount)
        except Exception:
            amount = 0.0

        data.append([num_participants, deadline_month, amount])
    return data

data = fetch_expenses()
data = np.array(data)
print(data.shape)
print(data[:5])

data = fetch_expenses()
data = np.array(data)

# 3. Prepare features and target
# Assuming data columns: [participants, deadline_month, amount]
X = data[:, :2]  # participants and deadline_month
y = data[:, 2:]  # amount (target)

# 4. Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# 5. Normalize features
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# 6. Build and train model
model = Sequential([
    Input(shape=(2,)),
    Dense(8, activation='relu'),
    Dense(4, activation='relu'),
    Dense(1)
])

model.compile(optimizer='adam', loss='mse', metrics=['mae'])
model.fit(X_train, y_train, epochs=50, verbose=1)

model.save("owenus_model.h5")
=======
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
>>>>>>> d0ac0c7e40e7e85af1542f61636785594387843f
