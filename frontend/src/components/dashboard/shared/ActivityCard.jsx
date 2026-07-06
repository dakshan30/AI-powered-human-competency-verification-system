import React from "react";

import GlassCard from "./GlassCard";

import "./activityCard.css";

const formatDate = (date) => {

    if (!date) return "-";

    return new Date(date).toLocaleString("en-IN", {

        day: "2-digit",

        month: "short",

        year: "numeric",

        hour: "2-digit",

        minute: "2-digit"

    });

};

const getBadgeClass = (recommendation = "") => {

    switch (recommendation.toUpperCase()) {

        case "STRONG HIRE":
            return "badge-strong";

        case "HIRE":
            return "badge-hire";

        case "REJECT":
            return "badge-reject";

        default:
            return "badge-hold";

    }

};

const ActivityCard = ({
    activities = [],
}) => {

    return (

        <GlassCard className="activity-card">

            <div className="analytics-header">

                <h3>

                    Recent Candidate Activity

                </h3>

            </div>

            {

                activities.length === 0 ?

                    (

                        <div className="empty-state">

                            No interview activity found.

                        </div>

                    )

                    :

                    (

                        <div className="activity-list">

                            {

                                activities.map((activity) => (

                                    <div

                                        key={activity.id}

                                        className="activity-item"

                                    >

                                        <div className="activity-dot" />

                                        <div className="activity-content">

                                            <div className="activity-top">

                                                <h4>

                                                    {activity.candidate}

                                                </h4>

                                                <span

                                                    className={`recommendation-badge ${getBadgeClass(activity.recommendation)}`}

                                                >

                                                    {activity.recommendation}

                                                </span>

                                            </div>

                                            <p>

                                                Competency Score :

                                                {" "}
                                              <strong>
                                                    {activity.competency}%

                                                </strong>

                                            </p>

                                            <small>

                                                {activity.email}

                                            </small>

                                            <span className="activity-time">

                                                {formatDate(activity.createdAt)}

                                            </span>

                                        </div>

                                    </div>

                                ))

                            }

                        </div>

                    )

            }

        </GlassCard>

    );

};

export default ActivityCard;