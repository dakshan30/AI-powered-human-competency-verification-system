const Interview = require("../models/Interview");
const Resume = require("../models/Resume");
const User = require("../models/User");

/*
=====================================================
DASHBOARD OVERVIEW
=====================================================
*/

const getDashboardOverview = async () => {

    const [
        totalCandidates,
        totalResumes,
        completedInterviews,
        pendingInterviews,
        interviews
    ] = await Promise.all([

        User.countDocuments({
            role: "candidate"
        }),

        Resume.countDocuments(),

        Interview.countDocuments({
            status: "completed"
        }),

        Interview.countDocuments({
            status: {
                $ne: "completed"
            }
        }),

        Interview.find({
            status: "completed"
        })
        .populate("candidate", "name email")
        .populate("resume", "atsScore")
        .sort({
            createdAt: -1
        })

    ]);

    /*
    ===============================================
    DEFAULT VALUES
    ===============================================
    */

    let technical = 0;

    let communication = 0;

    let confidence = 0;

    let problemSolving = 0;

    let competency = 0;

    let trust = 0;

    let strongHire = 0;

    let hire = 0;

    let hold = 0;

    let reject = 0;

    /*
    ===============================================
    LOOP
    ===============================================
    */

    interviews.forEach((item) => {

        technical += item.overallScores?.technical || 0;

        communication += item.overallScores?.communication || 0;

        confidence += item.overallScores?.confidence || 0;

        problemSolving += item.overallScores?.problemSolving || 0;

        competency += item.overallScores?.competency || 0;

        trust += item.report?.trustScore || 100;

        const recommendation =
            item.report?.recommendation ||
            "HOLD";

        switch (recommendation.toUpperCase()) {

            case "STRONG HIRE":

                strongHire++;

                break;

            case "HIRE":

                hire++;

                break;

            case "REJECT":

                reject++;

                break;

            default:

                hold++;

        }

    });

    const count =
        interviews.length || 1;

    /*
    ===============================================
    RECENT ACTIVITIES
    ===============================================
    */

    const recentActivities =
        interviews
            .slice(0, 8)
            .map((interview) => ({

                id:
                    interview._id,

                candidate:
                    interview.candidate?.name,

                competency:
                    interview.overallScores?.competency,

                recommendation:
                    interview.report?.recommendation,

                createdAt:
                    interview.createdAt

            }));

    /*
    ===============================================
    RETURN
    ===============================================
    */

    return {

        overview: {

            totalCandidates,

            totalResumes,

            completedInterviews,

            pendingInterviews,

            averageTechnical:
                Number(
                    (technical / count).toFixed(1)
                ),

            averageCommunication:
                Number(
                    (communication / count).toFixed(1)
                ),

            averageConfidence:
                Number(
                    (confidence / count).toFixed(1)
                ),

            averageProblemSolving:
                Number(
                    (problemSolving / count).toFixed(1)
                ),

            averageCompetency:
                Number(
                    (competency / count).toFixed(1)
                ),

            averageTrustScore:
                Number(
                    (trust / count).toFixed(1)
                )

        },

        recommendationStats: {

            strongHire,

            hire,

            hold,

            reject

        },

        recentActivities

    };

};

module.exports = {

    getDashboardOverview

};