**_Collections_**

1.  User
    (uid)

    - role : "student" | "admin" | "teacher"
      a. student:

           - nameKo
           - id
           - nameEn
           - phone
           - birth
           - level: Level
           - updatedAt
           - {likes}:
              (Product.id)
              - name: string
              - do: int
              - updatedAt
           - {cart}:
              (Product.id)
              - name: string
              - do: int
              - createdAt

            // product vs bought
           - {bought}:
              (Product.id)
              - name: string
              - do: int
              - created_at

      b. teacher:

           - name
           - {classes}
            (Class.id)

           - created_at

2.  Level
    (id)

    - name: string
    - weight: int
    - children?: string[]
    - students?: User("student").id[]
    - classes: int

3.  Class
    (id)

    - classname: string
    - textbook: string
    - default_teacher: User("teacher").uid
    - teached_by: User("teacher).uid
    - last_class_at: timeStamp || string
    - students: User("student").uid[]
    - Level: Level.id
    - displayed_Level: string
    - TimeCategory: TimeCategory.id
    - displayed_TimeCategory: string

4.  Do
    (User("student").uid)

    - balance: int
    - {records}:
      (id)
      // - type: "withdraw" || "deposit"
      - amount: int
      - detail: string
      - balance: int
      - createdBy: string
      - created_at: timestamp || string

5.  Attendance
    (Date)

    dayOfWeek: number
    absents: string[]

6.  Product
    (id)

    name: string
    won: int
    do: int
    img: string
    is_offline: boolean = false
    stock: int
    create_at: timeStamp || string

7.  Order
    (id)

    - student_id: User("student").uid
    - student_name: string
    - product_id: Product.id
    - product_name: string
    - count: int
    - total_price: int
    - created_at: timeStamp || string
    - is_valid: boolean = true
    - status: "pending" || "cancel" || "ordered" || "complete"
    - status_detail?: string = null

https://dribbble.com/shots/5908138-Textemo-business-dashboard-for-translations/attachments/1270845
