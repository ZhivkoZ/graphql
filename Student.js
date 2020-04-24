import Student from "../../models/Student";
import {response} from 'express';

export default {
    Query: {
        singleStudent: (root, args) => {
            return new Promise((resolve, reject) => {
                Student.findOne(args).exec((error, response) => {
                    error ? reject(error) : resolve(response);
                })
            })
        },

        allStudents: () => {
            return new Promise((resolve, reject) => {
                Student.find({}).populate().exec((error, response) => {
                    error ? reject(error) : resolve(response);
                })
            })
        }
    },

    Mutation: {
        addStudent: (root, {name, subject, level}) => {
            const newStudent = new Student({name, subject, level});
            return new Promise((resolve, reject) => {
                newStudent.save((error, response) => {
                    error ? reject(error) : resolve(response);
                })
            })
        },

        updateStudent: (root, {_id, name, subject, level}) => {
            return new Promise ((resolve, reject) => {
                Student.findAndUpdate({_id}, {$set: {name, subject, level}}, {new : true}).exec((error, response) => {
                    error ? reject(error) : resolve(response);
                })
            })
        },

        deleteStudent: (root, {_id}) => {
            return new Promise ((resolve, reject) => {
                Student.findAndRemove({_id}).exec((error, response) => {
                    error ? reject(error) : resolve(response);
                })
            })
        }
    }
}