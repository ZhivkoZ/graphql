import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const StudentSchema = new Schema({
    name: {
        type:String,
        required:true
    },
    subject: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true
    }
})

const Student = mongoose.Schema("Student", StudentSchema);

export default Student;