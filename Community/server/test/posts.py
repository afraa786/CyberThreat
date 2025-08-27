import requests

url = "http://127.0.0.1:8000/api/community/posts/"
headers = {
    "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZXhwIjoxNzU2NTIzNDY2LCJpYXQiOjE3NTU5MTg2NjZ9.Q41o9kUuZq75QPglK4Zq6-PCy1f4KpON63IO7Lgrxw8",
    "x-auth-app": "APPUBADMASHHAIEKNUMBERKI"
}
data = {
    "title": "My Post",
    "content": "Some content",
    "community": 1
}
files = [
    ("files", open("fareed.jpeg", "rb")),
    ("files", open("college_logo.png", "rb"))
]

response = requests.post(url, headers=headers, data=data, files=files)
print(response.status_code)
# print(response.json())
