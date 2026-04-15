import os
import tensorflow as tf
import tensorflow_hub as hub
import numpy as np
import pickle
from datasets import load_dataset
from sklearn.utils.class_weight import compute_class_weight

# ── Dataset ───────────────────────────────────────────────────────────────────
dataset = load_dataset("clinc_oos", "plus")

train_texts = list(dataset["train"]["text"])
train_labels = dataset["train"]["intent"]
val_texts   = list(dataset["validation"]["text"])
val_labels  = dataset["validation"]["intent"]

y_train = np.array(train_labels)
y_val   = np.array(val_labels)

# Intent names from CLINC150 features
intent_names = dataset["train"].features["intent"].names
num_classes  = len(intent_names)

print(f"Number of intents: {num_classes}")

# ── Embeddings (Universal Sentence Encoder) ───────────────────────────────────
print("Loading USE...")
embed = hub.load("https://tfhub.dev/google/universal-sentence-encoder/4")

print("Encoding train texts...")
X_train = embed(train_texts).numpy()   # shape: (N, 512)

print("Encoding val texts...")
X_val = embed(val_texts).numpy()

# ── Class weights (handles CLINC150 imbalance) ────────────────────────────────
class_weights = compute_class_weight(
    class_weight="balanced",
    classes=np.unique(y_train),
    y=y_train
)
class_weight_dict = dict(enumerate(class_weights))

# ── Model ─────────────────────────────────────────────────────────────────────
model = tf.keras.Sequential([
    tf.keras.layers.Input(shape=(512,)),
    tf.keras.layers.Dense(256, activation="relu"),
    tf.keras.layers.Dropout(0.3),
    tf.keras.layers.Dense(128, activation="relu"),
    tf.keras.layers.Dropout(0.3),
    tf.keras.layers.Dense(num_classes, activation="softmax")
])

model.compile(
    loss="sparse_categorical_crossentropy",
    optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
    metrics=["accuracy"]
)

model.summary()

# ── Training ──────────────────────────────────────────────────────────────────
callbacks = [
    tf.keras.callbacks.EarlyStopping(patience=3, restore_best_weights=True),
    tf.keras.callbacks.ReduceLROnPlateau(patience=2, factor=0.5, verbose=1)
]

model.fit(
    X_train, y_train,
    epochs=20,
    validation_data=(X_val, y_val),
    batch_size=32,
    class_weight=class_weight_dict,
    callbacks=callbacks
)

# ── Save artifacts ────────────────────────────────────────────────────────────
model.save("intent_model.keras")
print("Saved intent_model.keras")

with open("intent_names.pkl", "wb") as f:
    pickle.dump(intent_names, f)
print("Saved intent_names.pkl")

# Sanity check
val_loss, val_acc = model.evaluate(X_val, y_val, verbose=0)
print(f"\nFinal val accuracy: {val_acc:.4f} | val loss: {val_loss:.4f}")
