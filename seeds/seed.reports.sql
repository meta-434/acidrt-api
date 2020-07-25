insert into reports (
    report_first ,
    report_last ,
    report_email ,
    report_phone ,
    report_lat ,
    report_lng ,
    report_date ,
    report_type ,
    report_time,
    report_waterBody ,
    report_other ,
    report_details
)
values
    (
        'Alexandre',
        'Hapgood',
        'ach1@vt.edu',
        '434-249-7488',
        38.09802480089654,
        -78.4887256216315,
        '2020-01-01',
        'Suspicious discharge from pipe into stream, Suspicious suds or other substance floating on water',
        '12:34',
        'James River',
        'I feel pretty ok, how about you?',
        'the quick brown fox jumped over the lazy dog'
    ),
    (
        'john',
        'doe',
        'email@email.com',
        '123-123-1234',
        38.030425,
        -78.561065,
        '2020-02-02',
        'Suspicious discharge from pipe into stream',
        '12:01',
        'Rivanna River',
        'abcd efgh ijkl',
        'the slow blue cat tripped over the energetic lemur'
    )

;