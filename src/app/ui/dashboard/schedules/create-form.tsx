"use client";

import { useFormState } from "react-dom";
import { Button, CancelButton } from "../buttons";
import { useEffect, useState } from "react";

import { ErrorBox, FormRow, Slash, UnderArr } from "../form";

import { FrontendClass } from "@/definitions/class-types";
import {
  ADMIN_CLASS_BASE_PATH,
  CLASS_BASE_PATH,
  DAY_OF_WEEKS,
} from "@/lib/constants";
import { createSchedule } from "@/lib/actions/schedule-actions";

function formatTime(hour: number, minute: number) {
  return (
    (hour < 10 ? "0" : "") + hour + ":" + (minute < 10 ? "0" : "") + minute
  );
}
function getDefaultEndTime(time: string) {
  const startTime = new Date("1970-01-01T" + time);

  startTime.setMinutes(startTime.getMinutes() + 40);
  return formatTime(startTime.getHours(), startTime.getMinutes());
}

function CreateScheduleForm({
  forAdmin,
  _class,
}: {
  forAdmin: boolean;
  _class: FrontendClass;
}) {
  const today = new Date();

  const [startTime, setStartTime] = useState(
    formatTime(today.getHours(), today.getMinutes())
  );
  const [endTime, setEndTime] = useState(getDefaultEndTime(startTime));
  useEffect(() => {
    setEndTime(getDefaultEndTime(startTime));
  }, [startTime]);

  const createScheduleWithBind = createSchedule.bind(null, forAdmin, _class);
  const initialState = { message: "" };
  const [state, dispatch] = useFormState(createScheduleWithBind, initialState);
  return (
    <form action={dispatch} className="flex flex-col">
      <div className="w-full my-10 ">
        {/*Name && Textbook */}
        <div className="flex gap-x-20">
          {/*Name*/}
          <FormRow label="Name" disabled>
            <div className="input-field  ">{_class.name}</div>
          </FormRow>
          {/*Textbook*/}
          <FormRow label="Textbook" disabled>
            <div className="input-field  ">{_class.textbook} </div>
          </FormRow>
        </div>

        {/*Teacher && Level */}
        <div className="flex gap-x-20">
          {/*Teacher*/}
          <FormRow label="Teacher" disabled>
            <div className="input-field  ">{_class.teacherName} </div>
          </FormRow>

          {/*Level*/}
          <FormRow label="Level" disabled>
            <div className="flex gap-x-8">
              <div className="relative flex-1">
                <div className="input-field ">{_class.levelName}</div>
              </div>
              <div className="relative flex-1">
                <div className="input-field">{_class.division}</div>
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
        <CancelButton
          href={
            forAdmin
              ? ADMIN_CLASS_BASE_PATH + `/${_class.id}/schedules`
              : CLASS_BASE_PATH + `/${_class.id}/schedules`
          }
        />
        <Button type="submit">Create</Button>
      </div>
    </form>
  );
}

export default CreateScheduleForm;
