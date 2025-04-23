"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";

// MUI Imports
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';

// Store Import
import { useRoomStore } from "@core/domain/store/rooms/room.store";
import { Room } from "@core/domain/models/rooms/list.model";
import { RoomFormSchema } from "@core/domain/schemas/room.schema";

type RoomInput = z.infer<typeof RoomFormSchema>;

const defaultValues: RoomInput = {
    TypeId: 0,
    StatusId: 1,
    RoomPrice: 0,
};

interface RoomFormInputProps {
    open: boolean;
    onClose: () => void;
    selectedItem: Room | null;
}

const RoomFormInput = ({ open, onClose, selectedItem }: RoomFormInputProps) => {
    const { create, update, isSubmitting } = useRoomStore();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<RoomInput>({
        resolver: zodResolver(RoomFormSchema),
        defaultValues,
    });

    useEffect(() => {
        if (selectedItem) {
            const formData = {
                TypeId: selectedItem.TypeId,
                StatusId: selectedItem.StatusId,
                RoomPrice: selectedItem.RoomPrice,
            };
            reset(formData);
        } else {
            reset(defaultValues);
        }
    }, [selectedItem, reset]);

    const handleFormSubmit = async (data: RoomInput) => {
        try {
            if (selectedItem) {
                await update(selectedItem.RoomId, data);
                // Success message would go here
            } else {
                await create(data);
                // Success message would go here
            }
            reset(defaultValues);
            onClose();
        } catch (error) {
            // Error message would go here
            console.error('Error saving room:', error);
        }
    };

    const handleDialogClose = () => {
        reset(defaultValues);
        onClose();
    };

    const roomTypes = [
        { TypeId: 1, TypeName: 'Standard' },
        { TypeId: 2, TypeName: 'Deluxe' },
        { TypeId: 3, TypeName: 'Suite' }
    ];

    const roomStatuses = [
        { StatusId: 1, StatusName: 'Available' },
        { StatusId: 2, StatusName: 'Occupied' },
        { StatusId: 3, StatusName: 'Maintenance' }
    ];

    return (
        <Dialog
            open={open}
            onClose={handleDialogClose}
            fullWidth
            maxWidth="sm"
            disableEscapeKeyDown={isSubmitting}
        >
            <DialogTitle>
                {selectedItem ? "แก้ไขข้อมูลห้องพัก" : "เพิ่มห้องพักใหม่"}
            </DialogTitle>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <DialogContent>
                    <Grid container spacing={3} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <Controller
                                name="TypeId"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth error={!!errors.TypeId}>
                                        <InputLabel id="room-type-label">ประเภทห้องพัก</InputLabel>
                                        <Select
                                            {...field}
                                            labelId="room-type-label"
                                            label="ประเภทห้องพัก"
                                        >
                                            {roomTypes.map(type => (
                                                <MenuItem key={type.TypeId} value={type.TypeId}>
                                                    {type.TypeName}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {errors.TypeId && (
                                            <FormHelperText>{errors.TypeId.message}</FormHelperText>
                                        )}
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        
                        <Grid item xs={12}>
                            <Controller
                                name="StatusId"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth error={!!errors.StatusId}>
                                        <InputLabel id="room-status-label">สถานะห้องพัก</InputLabel>
                                        <Select
                                            {...field}
                                            labelId="room-status-label"
                                            label="สถานะห้องพัก"
                                        >
                                            {roomStatuses.map(status => (
                                                <MenuItem key={status.StatusId} value={status.StatusId}>
                                                    {status.StatusName}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {errors.StatusId && (
                                            <FormHelperText>{errors.StatusId.message}</FormHelperText>
                                        )}
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        
                        <Grid item xs={12}>
                            <Controller
                                name="RoomPrice"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="ราคาห้องพัก"
                                        type="number"
                                        fullWidth
                                        error={!!errors.RoomPrice}
                                        helperText={errors.RoomPrice?.message}
                                        InputProps={{ 
                                            startAdornment: <Box component="span" sx={{ mr: 1 }}>฿</Box> 
                                        }}
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={handleDialogClose} 
                        color="secondary"
                        disabled={isSubmitting}
                    >
                        ยกเลิก
                    </Button>
                    <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'กำลังบันทึก...' : 'บันทึก'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default RoomFormInput;