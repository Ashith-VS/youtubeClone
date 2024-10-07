import { MeetingProvider } from "@videosdk.live/react-sdk";
import React from "react";
import MediaControlsContainer from "./MediaControlsContainer";
import ParticipantsGridContainer from "./ParticipantsGridContainer";

import { authToken } from "./CreatingRoom";
import { useSelector } from "react-redux";


const SpeakerScreenContainer = ({ meetingId }) => {
  const { currentUser } = useSelector(state => state.common)

  return (
    <MeetingProvider
      token={authToken}
      config={{
        meetingId,
        name: currentUser?.name,
        micEnabled: true,
        webcamEnabled: true,
      }}
      joinWithoutUserInteraction
    >
      <MediaControlsContainer meetingId={meetingId} />
      <ParticipantsGridContainer />
    </MeetingProvider>
  );
};

export default SpeakerScreenContainer;