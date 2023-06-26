**API LIST**
----
  Update User Profile.

* **URL**

  /api/users/update

* **Method:**
  
  `POST`

* **Data Params**
```
    "name": "Binh Minh",
    "age": "21",
    "sex": "male",
    "nation": "Vietnamese",
    "location": "Hung Yen",
    "bio" : "Test"
```

* **Success Response:**
  
  * **Code:** 200 <br />
    **Content:**
    ```
    "id": 3,
    "email": "testp",
    "password": "$2b$10$Rk8sGUJqy63HVn0t091gwuVuiJTpnk4yBAViSDkqwjai5pGqjrHC.",
    "role": "partner",
    "name": "Binh Minh",
    "nation": "Vietnamese",
    "location": "Hung Yen",
    "sex": "male",
    "age": 21,
    "bio": "Test",
    "rating": null,
    "avatar": "test/ggmtadhwdxl5kndcknsy",
    "created_at": "2023-06-24T06:43:48.871Z",
    "updated_at": "2023-06-24T07:53:49.090Z"
* **Error Response:**
* 
  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{ error : "Log in" }`

  OR

  * **Code:** 422 UNPROCESSABLE ENTRY <br />
    **Content:** `{ error : "Email Invalid" }`

* **Notes:**

 Login trước khi chỉnh sửa user profile
