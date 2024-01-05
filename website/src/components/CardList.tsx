import { CardListProps } from "@/types";
import React from "react";
import { Card } from ".";

function CardList({
    filteredStudents,
    entries,
    students,
    setShouldRerender,
}: CardListProps) {
    let entryList = new Map<string, any>();

    for (let entry in entries.entries) {
        for (let concerned of entries.entries[entry].concerned) {
            if (filteredStudents.has(concerned)) {
                if (entryList.has(concerned))
                    entryList.get(concerned)[entry] = entries.entries[entry];
                else {
                    let l: any = {};
                    l[entry] = entries.entries[entry];
                    entryList.set(concerned, l);
                }
            }
        }
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3" key="cardlist">
            {Array.from(filteredStudents.keys()).map(key => {
                let student: any = filteredStudents.get(key) || {};
                return (
                    <Card
                        key={key}
                        setShouldRerender={setShouldRerender}
                        id={key}
                        classroom={student.classroom}
                        name={student.name}
                        functions={student.functions}
                        starred={entries.starred}
                        students={students}
                        entries={entryList.get(key) || {}}
                    />
                );
            })}
        </div>
    );
}

export default CardList;
