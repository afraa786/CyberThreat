import pickle

# Purana model load karo
with open("pickle/model.pkl", "rb") as file:
    gbc = pickle.load(file)

# Model ka naya attribute update karo
gbc.n_features_in_ = gbc.n_features_

# Naya model save karo
with open("pickle/new_model.pkl", "wb") as file:
    pickle.dump(gbc, file)

print("Model updated successfully!")
