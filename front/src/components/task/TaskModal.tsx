import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Alert,
  Box,
  Typography,
  Paper
} from "@mui/material";
import { useThemeColors } from "../ThemeModeContext";
import { useTranslation } from "react-i18next";
import type { TaskModalProps, TaskType } from "../../models/tasks.interface";
import { 
  TASK_TYPE_LABELS, 
  TASK_TYPE_COLORS, 
  TASK_TYPE_ICONS,
  getTaskTypes 
} from "../../models/tasks.interface";

const TaskModal = ({
  open,
  onClose,
  onSave,
  editingTask,
  taskTitle,
  setTaskTitle,
  taskType,
  setTaskType,
  taskDescription,
  setTaskDescription,
  error,
}: TaskModalProps) => {
  const { t } = useTranslation();
  const colors = useThemeColors();

  const taskTypes = getTaskTypes();

  const handleTypeClick = (type: TaskType) => (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setTaskType(type);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      onClick={(e) => e.stopPropagation()}
    >
      <DialogTitle sx={{ color: colors.text.primary, pb: 1 }}>
        {editingTask ? t("pages.tasks.modal.editTitle") : t("pages.tasks.modal.addTitle")}
      </DialogTitle>
      
      <DialogContent sx={{ pt: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          autoFocus
          margin="dense"
          label={t("pages.tasks.modal.titleLabel")}
          type="text"
          fullWidth
          variant="outlined"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSave(taskTitle, taskType, taskDescription);
            }
          }}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              backgroundColor: colors.background.sidebar,
              "& fieldset": {
                borderColor: colors.border,
              },
              "&:hover fieldset": {
                borderColor: colors.primary,
              },
              "&.Mui-focused fieldset": {
                borderColor: colors.primary,
              },
            },
            "& .MuiInputLabel-root": {
              color: colors.text.secondary,
            },
            "& .MuiOutlinedInput-input": {
              color: colors.text.primary,
            },
          }}
        />

        <Box sx={{ mb: 2 }}>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              color: colors.text.secondary,
              mb: 1.5,
              fontWeight: 600
            }}
          >
            {t("pages.tasks.modal.typeLabel") || "Catégorie"}
          </Typography>

          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 1.5
          }}>
            {taskTypes.map((type: TaskType) => {
              const isSelected = taskType === type;
              const typeColor = TASK_TYPE_COLORS[type];
              const typeLabel = TASK_TYPE_LABELS[type];
              const IconComponent = TASK_TYPE_ICONS[type];
              
              return (
                <Paper
                  key={type}
                  elevation={isSelected ? 4 : 1}
                  onClick={handleTypeClick(type)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.8,
                    px: 2,
                    py: 1,
                    borderRadius: '20px',
                    backgroundColor: isSelected ? typeColor : colors.background.sidebar,
                    color: isSelected ? '#FFFFFF' : colors.text.secondary,
                    border: `2px solid ${isSelected ? typeColor : colors.border}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    userSelect: 'none',
                    '&:hover': {
                      backgroundColor: isSelected ? typeColor : colors.background.hover,
                      borderColor: typeColor,
                      transform: 'translateY(-3px)',
                      boxShadow: `0 6px 12px ${typeColor}40`,
                    },
                    '&:active': {
                      transform: 'translateY(-1px)',
                      boxShadow: `0 2px 4px ${typeColor}40`,
                    },
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    color: isSelected ? '#FFFFFF' : colors.text.tertiary
                  }}>
                    <IconComponent sx={{ fontSize: '1.1rem' }} />
                  </Box>
                  <Typography sx={{ 
                    fontSize: '0.85rem',
                    fontWeight: isSelected ? 700 : 500,
                    color: 'inherit',
                    lineHeight: 1
                  }}>
                    {typeLabel}
                  </Typography>
                </Paper>
              );
            })}
          </Box>
        </Box>

        <TextField
          margin="dense"
          label={t("pages.tasks.modal.descriptionLabel") || "Description (optionnelle)"}
          type="text"
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          placeholder={t("pages.tasks.modal.descriptionPlaceholder") || "Ajoutez des détails sur cette tâche..."}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: colors.background.sidebar,
              "& fieldset": {
                borderColor: colors.border,
              },
              "&:hover fieldset": {
                borderColor: colors.primary,
              },
              "&.Mui-focused fieldset": {
                borderColor: colors.primary,
              },
            },
            "& .MuiInputLabel-root": {
              color: colors.text.secondary,
            },
            "& .MuiOutlinedInput-input": {
              color: colors.text.primary,
            },
          }}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          onClick={onClose} 
          sx={{ 
            color: colors.text.tertiary,
            '&:hover': {
              backgroundColor: colors.background.hover,
            }
          }}
        >
          {t("common.cancel")}
        </Button>
        <Button
          onClick={() => onSave(taskTitle, taskType, taskDescription)}
          variant="contained"
          sx={{
            backgroundColor: colors.primary,
            color: colors.text.primary,
            "&:hover": {
              backgroundColor: colors.iconSelected,
            },
          }}
        >
          {editingTask ? t("common.edit") : t("common.add")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskModal;