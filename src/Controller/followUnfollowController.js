const followersModel = require("../Models/followUnfollowModel")
const validator = require("../Validator/validator");
const userModel = require("../Models/userSchema")
const blockModel = require("../Models/blockModel")


const follow = async (req, res) => {

    try {

        if (!validator.isValidBody(req.body)) {
            res.status(400).send({ status: false, msg: "ERROR! : BAD REQUEST please fill all fields" })
        }
        let result;
        const { request, personId } = req.body;
        // const userId = req.params.userId;
        const user = await userModel.findById({ _id: req.params.userId })
        if (!user) {
            return res.status(404).send({ status: false, msg: "ERROR! user not found" })
        }
        const person = await userModel.findById({ _id: personId });
        if (!person) {
            return res.status(404).send({ status: false, msg: "ERROR! person not found" })
        }
        const bolcDoc = await blockModel.findOne({ userId: user.id });

        if (bolcDoc && ( bolcDoc.userBlocked.indexOf(person.id) != -1 || bolcDoc.peopleBlocked.indexOf(person.id) != -1 )) {
            return res.status(400).send({ status: false, msg: "ERROR! you block this person or person blocked you" })
        }

        if (request === "follow" || request === "unfollow") {

            if (request === "follow") {
                let followers = await followersModel.findOne({ userId: user.id })//({new:true})

                if (followers != null && followers.following.indexOf(person.id) != -1) {

                    return res.status(200).send({ status: false, msg: "you already follow this person" })

                } else {
                    if (followers == null) {
                        followers = {
                            following: []
                        }
                        followers.userId = user.id;
                        followers.followingCount = 1;
                        followers.following.push(person.id)
                        result = await followersModel.create(followers)

                    } else {

                        followers.userId = user.id;
                        followers.followingCount++;
                        followers.following.push(person.id)

                        result = await followersModel.findOneAndUpdate({ userId: user.id }, followers, { new: true })
                    }
                    let followings = await followersModel.findOne({ userId: person.id })//({new:true})
                    if (followings == null) {
                        followings = {
                            followers: []
                        }
                        followings.userId = person.id;
                        followings.followersCount = 1;
                        followings.followers.push(user.id);
                        await followersModel.create(followings)


                    } else {
                        followings.userId = person.id;
                        followings.followersCount++;
                        followings.followers.push(user.id)
                        await followersModel.findOneAndUpdate({ userId: person.id }, followings, { new: true })

                    }
                }


                return res.status(200).send({ status: true, data: result })
            } else if (request === "unfollow") {

                const followers = await followersModel.findOne({ userId: user.id })//({new:true})
                if (!followers) {
                    return res.status(400).send({ status: true, msg: "user not found" })
                }
                const index = followers.following.indexOf(person.id);
                if (index != -1) {
                    followers.followingCount--;
                    followers.following.splice(index, 1)
                    await followersModel.findOneAndUpdate({ userId: user.id }, followers, { new: true })
                    const followingPerson = await followersModel.findOne({ userId: person.id })//({new:true})
                    if (!followingPerson) {
                        return res.status(200).send({ status: true, msg: "success" })
                    }
                    const followingIndex = followingPerson.followers.indexOf(user.id)
                    if (followingIndex != -1) {
                        followingPerson.followersCount--;
                        followingPerson.followers.splice(followingIndex, 1)
                        await followersModel.findOneAndUpdate({ userId: person.id }, followingPerson, { new: true })

                    }

                    return res.status(200).send({ status: true, data: "success" })

                } else {

                    return res.status(400).send({ status: false, msg: "Bad request you don't follow them" })
                }
            }

        } else {
            res.status(400).send({ status: false, msg: "ERROR! : BAD REQUEST" })

        }
    } catch (error) {

        return res.status(500).send({ error: error.message })

    }
}


module.exports.follow = follow;



