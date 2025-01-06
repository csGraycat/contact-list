from flask import request, jsonify
from config import app, db
from models import Contact


@app.route("/contacts", methods=["GET"])
def get_contacts():
    contacts = Contact.query.all()  # get all contacts (python objects) from the database
    json_contacts = list(map(lambda x: x.to_json(), contacts))  # convert python Contact objects into dictionaries
    return jsonify({'contacts': json_contacts})  # convert dictionaries into json


@app.route("/create_contact", methods=["POST"])
def create_contact():
    first_name = request.json.get("firstName")
    last_name = request.json.get("lastName")
    email = request.json.get("email")

    if not first_name or not last_name or not email:
        return (
            jsonify({"message": "You must include first name, last name and email"}), 
            400,
        )
    
    new_contact = Contact(first_name=first_name, last_name=last_name, email=email)
    try:
        db.session.add(new_contact)
        db.session.commit()
    except Exception as e:
        return jsonify({"message": str(e)}), 400
    
    return jsonify({"message": "Contact created!"}), 201


@app.route("/update_contact/<int:user_id>", methods=["PATCH"])  # <int:user_id> specifies the id of user to update, e.g. /update_contact/1
def update_contact(user_id):
    contact = Contact.query.get(user_id)  # find the user with the passed user_id

    if not contact:
        return jsonify({"message": "User not found"}), 404
    
    data = request.json  # the new data that we send to the server, the one we want to update the contact with.
    contact.first_name = data.get("firstName", contact.first_name)  # replace the first name with the new one (if provided; otherwise, remain the same as before)
    contact.last_name = data.get("lastName", contact.last_name)
    contact.email = data.get("email", contact.email)

    db.session.commit()

    return jsonify({"message": "User updated"}), 200


@app.route("/delete_contact/<int:user_id>", methods=["DELETE"])
def delete_contact(user_id):
    contact = Contact.query.get(user_id)  # find the user with the passed user_id

    if not contact:
        return jsonify({"message": "User not found"}), 404
    
    db.session.delete(contact)
    db.session.commit()

    return jsonify({"message": "User deleted"}), 200


if __name__ == "__main__":
    with app.app_context():
        db.create_all()  # create a db if don't have one

    app.run(debug=True)