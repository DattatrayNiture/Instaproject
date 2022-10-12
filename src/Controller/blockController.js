const followersModel = require("../Models/followUnfollowModel")
const validator = require("../Validator/validator");
const userModel = require("../Models/userSchema")
const blockModel = require("../Models/blockModel")


const block = async (req, res) => {

    try {

        if (!validator.isValidBody(req.body)) {
            res.status(400).send({ status: false, msg: "ERROR! : BAD REQUEST please fill all fields" })
        }
        let result;
        console.log("1")
        const { request, personId } = req.body;
        // const userId = req.params.userId;
        const user = await userModel.findById({ _id: req.params.userId })
        if (!user) {
            return res.status(404).send({ status: false, msg: "ERROR! user not found" })
        }
        console.log("2")

        const person = await userModel.findById({ _id: personId });
        if (!person) {
            return res.status(404).send({ status: false, msg: "ERROR! person not found" })
        }
        console.log("3")


        if (request === "block" || request === "unblock") {
            console.log("3")

            if (request === "block") {
                console.log("4")

                let blockDoc = await blockModel.findOne({ userId: user.id })//({new:true})

                if (blockDoc != null && blockDoc.userBlocked.indexOf(person.id) != -1) {

                    return res.status(200).send({ status: false, msg: "you already block this person" })

                } else {
                    if (blockDoc == null) {
                        blockDoc = {
                            userBlocked: []
                        }
                        blockDoc.userId = user.id;
                        //followers.followingCount = 1;
                        blockDoc.userBlocked.push(person.id)
                        result = await blockModel.create(blockDoc)

                    } else {

                        blockDoc.userId = user.id;
                        //followers.followingCount++;
                        blockDoc.userBlocked.push(person.id)

                        result = await blockModel.findOneAndUpdate({ userId: user.id }, blockDoc, { new: true })
                    }
                    let blockDoc2 = await blockModel.findOne({ userId: person.id })//({new:true})
                    if (blockDoc2 == null) {
                        blockDoc2 = {
                            peopleBlocked: []
                        }
                        blockDoc2.userId = person.id;
                        //followings.followersCount = 1;
                        blockDoc2.peopleBlocked.push(user.id);
                        await blockModel.create(blockDoc2)


                    } else {
                        blockDoc2.userId = person.id;
                        //followings.followersCount++;
                        blockDoc2.peopleBlocked.push(user.id)
                        await blockModel.findOneAndUpdate({ userId: person.id }, blockDoc2, { new: true })

                    }
                }


                return res.status(200).send({ status: true, data: result })
            } else if (request === "unblock") {
                console.log("5")

                const blockDoc = await blockModel.findOne({ userId: user.id })//({new:true})
                if (!blockDoc) {
                    return res.status(400).send({ status: true, msg: "user not bolcked so you can not unblock this user" })
                }
                console.log("6")

                const index = blockDoc.userBlocked.indexOf(person.id);
                if (index != -1) {
                    // followers.followingCount--;
                    blockDoc.userBlocked.splice(index, 1)
                    result = await blockModel.findOneAndUpdate({ userId: user.id }, blockDoc, { new: true })
                    const blockDoc2 = await blockModel.findOne({ userId: person.id })//({new:true})
                    if (!blockDoc2) {
                        return res.status(200).send({ status: true, msg: "success" })
                    }
                    const blockingIndex = blockDoc2.peopleBlocked.indexOf(user.id)
                    if (blockingIndex != -1) {
                        //followingPerson.followersCount--;
                        blockDoc2.peopleBlocked.splice(blockingIndex, 1)
                        await blockModel.findOneAndUpdate({ userId: person.id }, blockDoc2, { new: true })

                    }

                    return res.status(200).send({ status: true, data: result })

                } else {

                    return res.status(400).send({ status: false, msg: "Bad request user not blocked" })
                }
            }

        } else {
            res.status(400).send({ status: false, msg: "ERROR! : BAD REQUEST" })

        }
    } catch (error) {

        return res.status(500).send({ error: error.message })

    }
}


module.exports.block = block;



