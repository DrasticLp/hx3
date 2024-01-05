"use client";
import React, { useState } from "react";
import { AddEntry, CardList, CustomButton } from ".";
import { PdmSectionProps, studentMap } from "@/types";
import { TagInput } from "evergreen-ui";
import { FaidherbeFunctions } from "@/database";

function PdmSection({ data, entries, setShouldRerender }: PdmSectionProps) {
    const classroomList = Object.keys(data);
    const studentList: studentMap = new Map();

    for (let c of Object.keys(data))
        for (let id of Object.keys(data[c]["students"])) {
            let student = data[c]["students"][id];
            studentList.set(id, {
                name: student.name,
                classroom: c,
                functions: student.functions,
                description: student.description,
            });
        }

    const [addEntryOpened, setAddEntryOpened] = useState(false);
    const [values, setValues] = React.useState([""]);

    const tagList = classroomList.map(c => `Classe:${c}`);

    for (let s of studentList.keys())
        tagList.push(`Nom:${studentList.get(s)?.name}`);

    for (let f of FaidherbeFunctions) tagList.push(`Fonction:${f}`);

    const allValues = React.useMemo(() => tagList, []);
    const autocompleteItems = React.useMemo(
        () => allValues.filter(i => !values.includes(i)),
        [allValues, values]
    );

    let filteredStudents: studentMap = new Map();

    for (let s of studentList.keys()) {
        let student = studentList.get(s);

        if (!student) continue;

        let classTags = values.filter(v => v.startsWith("Classe:"));
        let classFilter =
            classTags.length == 0 ||
            values.includes(`Classe:${student?.classroom}`);

        let functionTags = values.filter(v => v.startsWith("Fonction:"));
        let functionFilter = functionTags.length == 0;

        for (let f of student?.functions)
            if (functionTags.includes(`Fonction:${f}`)) {
                functionFilter = true;
                break;
            }

        let nameTags = values.filter(v => v.startsWith("Nom:"));
        let nameFilters =
            nameTags.length == 0 || nameTags.includes(`Nom:${student.name}`);

        if (student && classFilter && functionFilter && nameFilters)
            filteredStudents.set(s, student);
    }

    return (
        <div className="mb-56 flex items-center justify-center flex-col w-full">
            <TagInput
                inputProps={{ placeholder: "Filtres de recherche" }}
                values={values}
                onChange={setValues}
                autocompleteItems={autocompleteItems}
            />
            <CustomButton
                title="Ajouter"
                handleClick={() => {
                    setAddEntryOpened(true);
                }}
                containerStyles="bg-primary-color text-white rounded-full mt-10"
            />
            <AddEntry
                opened={addEntryOpened}
                setOpened={setAddEntryOpened}
                students={studentList}
                setShouldRerender={setShouldRerender}
            />
            {
                <CardList
                    filteredStudents={filteredStudents}
                    entries={entries}
                    students={studentList}
                    setShouldRerender={setShouldRerender}
                />
            }
        </div>
    );
}

export default PdmSection;
