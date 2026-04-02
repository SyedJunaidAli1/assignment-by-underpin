## Bug: Pagination returns wrong results

Expected:
Page 1 with limit 2 should return first 2 tasks

Actual:
Returns wrong set of tasks because offset is incorrect

How discovered:
Unit test for getPaginated()

Fix:
Change offset from `page * limit` to `(page - 1) * limit`

## Bug: getByStatus matches partial strings

Expected:
Filtering "do" should return no tasks

Actual:
Returns tasks with "todo" because includes() is used

How discovered:
Unit test for getByStatus()

Fix:
Use strict equality (===) instead of includes()

## Bug: Task can be created without title

Expected:
Should throw error or reject invalid input

Actual:
Task is created with undefined title

How discovered:
Unit test for create()

Fix:
Add validation for required fields