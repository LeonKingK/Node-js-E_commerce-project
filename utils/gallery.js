const fs = require('fs');

let saveSingleFile = async (req, res, next) => {
    if (req.files) {
        if (req.files.file) {
            let filename = req.files.file.name;
            filename = new Date().valueOf() + "-" + filename;
            req.files.file.mv(`./uploads/${filename}`);
            req.body["image"] = filename;
            next();
        } else {
            next(new Error("A file is needed in request!"));
        }
    } else {
        next(new Error("A file is needed in request!"));
    }
};

let saveMultipleFile = async (req, res, next) => {
    let filenames = [];
    req.files.files.forEach(file => {
        let filename = new Date().valueOf() + "_" + file.name;
        filenames.push(filename);
        file.mv(`./uploads/${filename}`);
    });
    req.body["images"] = filenames;
    next();
};

let deleteFile=async(filename) =>{
    let filepath = `./uploads/$(filename)`;
    await fs.unlinkSync(filepath);
}



module.exports = {
    saveSingleFile,
    saveMultipleFile,
    deleteFile,
}