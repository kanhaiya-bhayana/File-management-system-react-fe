export const validateForm = (formData) => {
    let errors = {};
    if (formData.filename === "") {
        errors.filename = 'Filename is required';
    }

    if (formData.vendorname === "") {
        errors.vendorname = 'Vendorname is required';
    }
    if (formData.email === "") {
        errors.email = 'Email is required';
    }
    if (formData.email != "") {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(formData.email)){
            errors.email = 'Enter a valid email...';
        } 
    }
    if (formData.allowedfiletype === "") {
        errors.allowedfiletype = 'Allowedfiletype is required';
    }
    if (formData.templatefile === "") {
        errors.templatefile = 'Template file is required';
    }
    if (formData.dbnotebook === "") {
        errors.dbnotebook = 'Database notebook is required';
    }
    if (formData.insertionmode === "") {
        errors.insertionmode = 'Insertion mode is required';
    }
    if (formData.delimiter === "") {
        errors.delimiter = 'Delimiter is required';
    }

    return errors;
}

