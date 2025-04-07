import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ProfileOverlay = ({ open, onClose, address, role }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        Profile
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1"><strong>Address:</strong> {address}</Typography>
        <Typography variant="body1"><strong>Role:</strong> {role}</Typography>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileOverlay;
