"use client";

import { useFormState } from "react-dom";
import { Button, CancelButton, DeleteButton } from "../buttons";
import { useEffect, useState } from "react";

import { ErrorBox, FormRow, Slash, UnderArr } from "../form";

import { ADMIN_SCHEDULES_BASE_PATH, DAY_OF_WEEKS } from "@/lib/constants";
import { deleteSchedule, updateSchedule } from "@/lib/actions/schedule-actions";
import { FrontendSchedule } from "@/definitions/schedule-types";
import { FrontendTeacher } from "@/definitions/teacher-types";
import { formatTimeToString, getDefaultEndTime } from "@/lib/utils";

function EditScheduleForm({
  id,
  schedule,
  teachers,
}: {
  id: string;
  schedule: FrontendSchedule;
  teachers: FrontendTeacher[];
}) {
  const [teacher, setTeacher] = useState(
    teachers.find((teacher) => teacher.id == schedule.defaultTeacher) ??
      teachers[0]
  );

  const [startTime, setStartTime] = useState(
    formatTimeToString(schedule.startTime)
  );
  const [endTime, setEndTime] = useState(formatTimeToString(schedule.endTime));
  useEffect(() => {
    setEndTime(getDefaultEndTime(startTime));
  }, [startTime]);

  const updateScheduleWithBind = updateSchedule.bind(null, id, teacher.name);
  const initialState = { message: "" };
  const [state, dispatch] = useFormState(updateScheduleWithBind, initialState);
  const deleteScheduleWithBind = deleteSchedule.bind(
    null,
    schedule._class,
    id,
    schedule.attendees
  );
  return (
    <form action={dispatch} className="flex flex-col">
      <div className="w-full my-10 ">
        {/*Name && Textbook */}
        <div className="flex gap-x-20">
          {/*Name*/}
          <FormRow label="Name" disabled>
            <div className="input-field  ">{schedule._className}</div>
          </FormRow>
          {/*Textbook*/}
          <FormRow label="Textbook" disabled>
            <div className="input-field  ">{schedule.textbook} </div>
          </FormRow>
        </div>

        {/*Teacher && Level */}
        <div className="flex gap-x-20">
          {/*Teacher*/}
          <FormRow label="Teacher">
            <div className="relative flex-1">
              <select
                id="teacher"
                name="teacher"
                className="input-field appearance-none cursor-pointer pl-8"
                onChange={(e) => {
                  setTeacher(
                    teachers.find((teacher) => teacher.id == e.target.value)!
                  );
                }}
                value={teacher.id}
              >
                <option value="" disabled>
                  Select Teacher
                </option>
                {teachers?.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
              <Slash />
              <UnderArr />
            </div>
          </FormRow>

          {/*Level*/}
          <FormRow label="Level" disabled>
            <div className="flex gap-x-8">
              <div className="relative flex-1">
                <div className="input-field ">{schedule.levelName}</div>
              </div>
              <div className="relative flex-1">
                <div className="input-field">{schedule.division}</div>
              </div>
            </div>
          </FormRow>
        </div>

        {/*DAYOFTHEWEEK+PERIOD && TIME*/}
        <div className="flex gap-x-20">
          {/*DAYOFTHEWEEK+PERIOD*/}
          <div className="flex flex-1 gap-x-8">
            {/*DAYOFTHEWEEK*/}
            <FormRow label="DayOfWeek" required>
              <div className="relative flex-1">
                <select
                  id="dayOfWeek"
                  name="dayOfWeek"
                  className="input-field appearance-none cursor-pointer pl-8"
                  defaultValue={schedule.dayOfWeek}
                >
                  {DAY_OF_WEEKS.map((day) => (
                    <option key={day.backendFormat} value={day.backendFormat}>
                      {day.frontendFormat}
                    </option>
                  ))}
                </select>
                <Slash />
                <UnderArr />
              </div>
            </FormRow>
            {/*PERIOD*/}
            <FormRow label="Period" required>
              <div className="relative flex-1">
                <select
                  id="period"
                  name="period"
                  className="input-field appearance-none cursor-pointer pl-8"
                  defaultValue={schedule.period}
                >
                  {[1, 2, 3, 4, 5].map((period) => (
                    <option key={period} value={period}>
                      {period}
                    </option>
                  ))}
                </select>
                <Slash />
                <UnderArr />
              </div>
            </FormRow>
          </div>
          {/*TIME*/}
          <div className="flex flex-1 gap-x-8">
            <FormRow label="Start Time" required>
              <input
                id="start"
                name="start"
                type="time"
                className="input-field  "
                min="09:00"
                max="23:00"
                step={60 * 5}
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </FormRow>
            <FormRow label="End Time" required>
              <input
                id="end"
                name="end"
                type="time"
                className="input-field  "
                min="09:00"
                max="23:00"
                step={60 * 5}
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </FormRow>
          </div>
        </div>

        <div className="w-full flex items-center h-12 -mt-5">
          {state?.message && <ErrorBox message={state.message} />}
        </div>
      </div>

      <div className="flex w-full justify-between ">
        <div className="flex gap-x-4">
          <CancelButton href={ADMIN_SCHEDULES_BASE_PATH} />
          <DeleteButton action={deleteScheduleWithBind} disabled={false} />
        </div>
        <Button type="submit">Edit</Button>
      </div>
    </form>
  );
}

export default EditScheduleForm;
