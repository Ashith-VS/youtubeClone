import { useMeeting } from "@videosdk.live/react-sdk";
import React, { useMemo } from "react";
import SingleParticipantContainer from "./SingleParticipantContainer";


const ParticipantsGridContainer = () => {
  const { participants } = useMeeting();
  console.log('participants: ', participants);

  const participantIds = useMemo(
    () => [...participants.keys()],
    [participants]
  );

  return (
    <div>
      {participantIds.map((participantId) => (
        <SingleParticipantContainer
          {...{ participantId, key: participantId }}
        />
      ))}
    </div>
  );
};

export default ParticipantsGridContainer;