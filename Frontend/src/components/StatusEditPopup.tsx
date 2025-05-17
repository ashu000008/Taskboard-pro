import React from 'react';
import { Dialog, DialogTitle, DialogContent, FormControl, Select, MenuItem, Button } from '@mui/material';

interface StatusEditPopupProps {
  open: boolean;
  onClose: () => void;
  currentStatus: string;
  onStatusUpdate: (newStatus: string) => void;
}

const StatusEditPopup: React.FC<StatusEditPopupProps> = ({
  open,
  onClose,
  currentStatus,
  onStatusUpdate,
}) => {
  const [status, setStatus] = React.useState(currentStatus);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStatusUpdate(status);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Update Task Status</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value="TODO">Todo</MenuItem>
              <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
              <MenuItem value="COMPLETED">Completed</MenuItem>
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            Update Status
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StatusEditPopup;
