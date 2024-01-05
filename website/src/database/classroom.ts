import { log } from "console";
import { randomUUID } from "crypto";
import { FaidherbeFunctions } from ".";

export class Student {
    readonly id: string;
    classroom: Classroom;
    name: string;
    picture: string;
    functions: number[] = [];

    constructor(
        id: string,
        name: string,
        picture: string,
        classroom: Classroom
    ) {
        this.id = id;
        this.name = name;
        this.picture = picture;
        this.classroom = classroom;
    }

    changePicture(picture: string) {
        this.picture = picture;
        this.classroom.manager.markDirty();
    }

    toJson() {
        let functions = [];

        for (let f of this.functions) functions.push(FaidherbeFunctions[f]);

        return {
            name: this.name,
            picture: this.picture,
            functions: functions,
        };
    }
}

export class Classroom {
    readonly id: number;
    readonly year: number;
    readonly manager: ClassroomManager;
    students: Map<string, Student>;

    constructor(id: number, year: number, manager: ClassroomManager) {
        this.id = id;
        this.year = year;
        this.manager = manager;
        this.students = new Map();
    }

    addStudent(student: Student) {
        this.students.set(student.id, student);
        student.classroom = this;
        this.manager.markDirty();
    }

    toJson() {
        let students: any = {};

        for (let s of this.students) students[s[0]] = s[1].toJson();

        return {
            year: this.year,
            students: students,
        };
    }
}

export class ClassroomManager {
    classrooms: Map<number, Classroom> = new Map();
    isDirty: boolean = false;

    constructor(data: any) {
        for (let year in data) {
            let classroom = this.createClassroom(
                parseInt(year),
                data[year].year
            );

            for (let id in data[year].students) {
                let functions: number[] = [];
                for (let f of data[year].students[id].functions) {
                    functions.push(FaidherbeFunctions.indexOf(f));
                }

                this.createStudent(
                    id,
                    data[year].students[id].name,
                    data[year].students[id].picture,
                    functions,
                    classroom
                );
            }
        }
    }

    getClassroomsList(): Array<number> {
        return Array.from(this.classrooms.keys());
    }

    createClassroom(id: number, year: number) {
        let classroom = new Classroom(id, year, this);
        this.classrooms.set(id, classroom);

        this.markDirty();
        return classroom;
    }

    createStudent(
        id: string = randomUUID(),
        name: string,
        picture: string,
        functions: number[],
        classroom: Classroom
    ) {
        let student = new Student(id, name, picture, classroom);

        student.functions = functions;

        classroom.addStudent(student);
        return student;
    }

    switchClassroom(studentId: string, classroomId: number) {
        let student = this.getStudentById(studentId);
        let classroom = this.getClassroom(classroomId);

        if (!student || !classroom) return;

        student.classroom.students.delete(studentId);
        classroom.addStudent(student);

        this.markDirty();
    }

    getClassroom(id: number | string): Classroom | null {
        id = parseInt(id.toString());

        for (let classroom of this.classrooms.values()) {
            if (classroom.id == id) return classroom;
        }

        return null;
    }

    getStudentById(id: string): Student | null {
        for (let classroom of this.classrooms.values()) {
            for (let student of classroom.students.values())
                if (student.id == id) return student;
        }

        return null;
    }

    getStudentByName(name: string): Student | null {
        for (let classroom of this.classrooms.values()) {
            for (let student of classroom.students.values())
                if (student.name == name) return student;
        }

        return null;
    }

    getStudentByNameArray(name: string): Student | null {
        name = name.toLowerCase();
        for (let classroom of this.classrooms.values()) {
            for (let student of classroom.students.values()) {
                let a1 = student.name.toLowerCase().split(" ");
                let a2 = name.split(" ");
                let equal = areEqual(a1, a2);

                if (equal) return student;
            }
        }

        return null;
    }

    markDirty() {
        this.isDirty = true;
    }

    markClean() {
        this.isDirty = false;
    }

    toJson() {
        let res: any = {};

        for (let c of this.classrooms) res[c[0].toString()] = c[1].toJson();

        return res;
    }

    toJsonString() {
        return JSON.stringify(this.toJson(), null, 5);
    }
}

function areEqual(array1: any[], array2: any[]) {
    if (array1.length === array2.length) {
        return array1.every(element => {
            if (array2.includes(element)) {
                return true;
            }

            return false;
        });
    }

    return false;
}

function removeAccents(s: string) {
    var r = s.toLowerCase();
    r = r.replace(new RegExp(/\s/g), "");
    r = r.replace(new RegExp(/[àáâãäå]/g), "a");
    r = r.replace(new RegExp(/æ/g), "ae");
    r = r.replace(new RegExp(/ç/g), "c");
    r = r.replace(new RegExp(/[èéêë]/g), "e");
    r = r.replace(new RegExp(/[ìíîï]/g), "i");
    r = r.replace(new RegExp(/ñ/g), "n");
    r = r.replace(new RegExp(/[òóôõö]/g), "o");
    r = r.replace(new RegExp(/œ/g), "oe");
    r = r.replace(new RegExp(/[ùúûü]/g), "u");
    r = r.replace(new RegExp(/[ýÿ]/g), "y");
    r = r.replace(new RegExp(/\W/g), "");
    return r;
}
