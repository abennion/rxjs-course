import { Component, OnInit } from '@angular/core';
import { Course } from "../model/course";
import { interval, Observable, of, timer } from 'rxjs';
import { catchError, delayWhen, map, retryWhen, shareReplay, tap } from 'rxjs/operators';


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    beginnerCourses$: Observable<Course[]>;

    advancedCourses$: Observable<Course[]>;

    constructor() {

    }

    ngOnInit() {
        const http$ = createHttpObservable('/api/courses');

        const courses$ = http$.pipe(
            map(res => Object.values(res['payload']))
        )

        this.beginnerCourses$ = http$
            .pipe(
                map(courses => courses.pipe(
                    filter(course => course.category === 'BEGINNER'))
                )
            );

        this.advancedCourses$ = http$
            .pipe(
                map(courses => courses.pipe(
                    filter(course => course.category === 'ADVANCED'))
                )
            );

        // const sub = courses$.subscribe(
        //     (courses: any) => console.log(courses),
        //     () => { },
        //     () => console.log('completed')
        // );
    }
}

function createHttpObservable(url: string) {
    return Observable.create(observer => {
        fetch(url)
            .then(res => {
                return res.json();
            })
            .then(body => {
                observer.next(body);
                observer.complete();
            })
            .catch(err => {
                observer.error(err);
            })
    });
}