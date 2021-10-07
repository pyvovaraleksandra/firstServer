const { v4: uuid } = require('uuid');
const fs = require("fs")
const path = require("path")

class Course {
    constructor(title, price, img) {
        this.title = title;
        this.price = price;
        this.img = img;
        this.id = uuid()
    }

    getCourse() {
        return {
            title: this.title,
            price: this.price,
            img: this.img,
            id: this.id,
        }
    }

    async save() {
        const courses = await Course.getAll();
        courses.push(this.getCourse());

        fs.writeFile(
            path.join(__dirname, "..", "data", "courses.json"),
            JSON.stringify(courses),
            (err) => {
                return new Promise((resolve, reject) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve()
                    }
                })
            }
        )
    }

    static getAll() {
        return new Promise((resolve, reject) => {
            fs.readFile(
                path.join(__dirname, "..", "data", "courses.json"),
                "utf-8",
                (err, content) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(JSON.parse(content))
                    }
                }
            )
        })
    }

    static async getById(id) {
        const courses = await Course.getAll();

        return courses.find(({id: courseId}) => courseId === id)
    }

    static async update(course) {
        const courses = await Course.getAll();
        const targetIndex = courses.findIndex(c => c.id === course.id)
        courses[targetIndex] = course;

        fs.writeFile(
            path.join(__dirname, "..", "data", "courses.json"),
            JSON.stringify(courses),
            (err) => {
                return new Promise((resolve, reject) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve()
                    }
                })
            }
        )
    }
}

module.exports = Course