const path = require("path")
const fs = require("fs")

const cartJsonPath = path.join(path.dirname(process.mainModule.filename), "data", "cart.json")

class Cart {
    static async add(course) {
        const cart = await this.getItems();

        const targetIndex = cart.courses.findIndex(c => c.id === course.id);

        if (targetIndex !== -1) { // course is already added to cart
            const targetCourseInCart = cart.courses[targetIndex];
            targetCourseInCart.count++;
            cart.courses[targetIndex] = targetCourseInCart;
        } else { // first time adding course to cart
            course.count = 1;
            cart.courses.push(course);
        }

        cart.price += +course.price;

        return new Promise((resolve, reject) => {
            fs.writeFile(cartJsonPath, JSON.stringify(cart), (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })
    }

    static async remove(id) {
        const cart = await this.getItems();
        const targetIndex = cart.courses.findIndex(c => c.id === id);
        const targetCourse = cart.courses[targetIndex];

        if (targetCourse.count === 1) { //remove
            cart.courses = cart.courses.filter(c => c.id !== id)

        } else { // change count
            cart.courses[targetIndex].count--;
        }

        cart.price -= targetCourse.price;

        return new Promise((resolve, reject) => {
            fs.writeFile(cartJsonPath, JSON.stringify(cart), (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(cart)
                }
            })
        })
    }

    static getItems() {
        return new Promise((resolve, reject) => {
            fs.readFile(cartJsonPath, "utf-8", (err, content) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(JSON.parse(content))
                }
            })
        })
    }
}

module.exports = Cart