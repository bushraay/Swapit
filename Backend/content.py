from flask import Flask, jsonify
from pymongo import MongoClient
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd

# Initialize Flask app
app = Flask(__name__)

# MongoDB connection
client = MongoClient("mongodb+srv://ayesha:dRhXznyyTNous7EC@cluster0.af1kc.mongodb.net/SwapIt?retryWrites=true&w=majority")
db = client["SwapIt"]
collection = db["MergedCollection"]

def fetch_data_from_mongodb():
    """Fetch all data from MongoDB MergedCollection and convert it to a DataFrame."""
    data = list(collection.find({}, {"_id": 0}))  # Exclude MongoDB's default _id field
    return pd.DataFrame(data)

def recommend_users(user_id):
    df = fetch_data_from_mongodb()

    # Find the user by user_id
    user_row = df[df["User ID"] == user_id]
    if user_row.empty:
        return {"error": "User not found"}
    
    user_data = user_row.iloc[0]  # Extract user details
    wanted_category = user_data["Category (Skills I Want)"]
    wanted_skill = user_data["Skills I Want"]

    # Find users who have this category in "Skills I Have"
    matching_users = df[df["Category (Skills I Have)"] == wanted_category]
    matching_users = matching_users[matching_users["User ID"] != user_id]

    # Apply TF-IDF and cosine similarity
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(matching_users["Skills I Have"].astype(str))
    user_tfidf = vectorizer.transform([wanted_skill])

    similarity_scores = cosine_similarity(user_tfidf, tfidf_matrix).flatten()
    matching_users["Similarity Score"] = similarity_scores

    # Get top 10 recommended users
    top_10_recommendations = matching_users.sort_values(by="Similarity Score", ascending=False).head(10)
    
    return user_data.to_dict(), top_10_recommendations.to_dict(orient="records")

@app.route("/recommend", methods=["GET"])
def get_recommendations():
    df = fetch_data_from_mongodb()

    # Randomly select a user
    random_user = df.sample(1).iloc[0]  # Pick a random user
    user_id = random_user["User ID"]

    # Get recommendations for this user
    user_details, recommendations = recommend_users(user_id)

    return jsonify({
        "random_user": user_details,
        "recommended_users": recommendations
    })

if __name__ == "__main__":
    app.run(debug=True)
