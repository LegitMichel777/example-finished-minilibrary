export class Book {
    isOvertime() {
        if (this.myBorrowedTime === undefined) {
            return false;
        }
        const timeLimit = 3*30*24*60*60;
        let currentTime = Date.now();
        if (currentTime - this.myBorrowedTime >= timeLimit) {
            return true;
        }
        return false;
    }
    constructor(id, isbn, title, author, publisher, borrowedUser, borrowedUserWxName, myBorrowedTime) {
        this.id = id;
        this.isbn = isbn;
        this.title = title;
        this.author = author;
        this.publisher = publisher;
        this.borrowedUser = borrowedUser;
        this.borrowedUserWxName = borrowedUserWxName;
        this.myBorrowedTime = myBorrowedTime;
        this.isOvertimeValue = this.isOvertime();
    } 
}