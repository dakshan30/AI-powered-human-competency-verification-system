const User = require("../models/User");
const Interview = require("../models/Interview");
const Resume = require("../models/Resume");

/*
=====================================================
GET DASHBOARD STATS
=====================================================
*/

exports.getDashboardStats = async (req, res) => {

    try {

        /*
        =============================================
        DASHBOARD COUNTS
        =============================================
        */

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
        =============================================
        SCORE CALCULATION
        =============================================
        */

        let technical = 0;

        let communication = 0;

        let confidence = 0;

        let problemSolving = 0;

        let competency = 0;

        let atsScore = 0;

        let trustScore = 0;

        let strongHire = 0;

        let hire = 0;

        let hold = 0;

        let reject = 0;

        interviews.forEach((interview) => {

            technical +=
                interview.overallScores?.technical || 0;

            communication +=
                interview.overallScores?.communication || 0;

            confidence +=
                interview.overallScores?.confidence || 0;

            problemSolving +=
                interview.overallScores?.problemSolving || 0;

            competency +=
                interview.overallScores?.competency || 0;

            atsScore +=
                interview.resume?.atsScore || 0;

            trustScore +=
                interview.report?.trustScore || 100;

            const recommendation =
                (
                    interview.report?.recommendation ||
                    "HOLD"
                ).toUpperCase();

            switch (recommendation) {

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

        const total =
            interviews.length || 1;

        /*
        =============================================
        RECENT ACTIVITY
        =============================================
        */

        const recentActivity =
            interviews
                .slice(0, 10)
                .map((interview) => ({

                    id:
                        interview._id,

                    candidate:
                        interview.candidate?.name ||

                        "Unknown",

                    email:
                        interview.candidate?.email ||

                        "",

                    competency:
                        interview.overallScores
                            ?.competency || 0,

                    recommendation:
                        interview.report
                            ?.recommendation ||

                        "Pending",

                    createdAt:
                        interview.createdAt

                }));

        /*
        =============================================
        RESPONSE
        =============================================
        */

        res.status(200).json({

            success: true,

            data: {

                overview: {

                    totalCandidates,

                    totalResumes,

                    completedInterviews,

                    pendingInterviews,

                    averageTechnical:
                        Number(
                            (
                                technical / total
                            ).toFixed(1)
                        ),

                    averageCommunication:
                        Number(
                            (
                                communication / total
                            ).toFixed(1)
                        ),

                    averageConfidence:
                        Number(
                            (
                                confidence / total
                            ).toFixed(1)
                        ),

                    averageProblemSolving:
                        Number(
                            (
                                problemSolving / total
                            ).toFixed(1)
                        ),

                    averageCompetency:
                        Number(
                            (
                                competency / total
                            ).toFixed(1)
                        ),

                    averageATS:
                        Number(
                            (
                                atsScore / total
                            ).toFixed(1)
                        ),

                    averageTrustScore:
                        Number(
                            (
                                trustScore / total
                            ).toFixed(1)
                        )

                },

                recommendations: {

                    strongHire,

                    hire,

                    hold,

                    reject

                },

                recentActivity

            }

        });

    }

    catch (error) {

        console.error(
            "Dashboard Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Failed to load dashboard",

            error:
                process.env.NODE_ENV ===
                "development"

                    ? error.message

                    : undefined

        });

    }

};