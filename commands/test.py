def locks(events): 
    stack = []
    for event in events:
        event = event.split(" ")
        if event[0]=="ACQUIRE":
            stack.append(int(event[1]))
        elif event[0]=="RELEASE":
            if not stack:
                return False
            if stack[-1]==event[1]:
                stack.pop()
            else:
                return False
    if not stack:
        return True
    
events = ['ACQUIRE 364', 'RELEASE 84']
print(locks(events))