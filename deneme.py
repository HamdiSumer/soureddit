val = ["['AskReddit']"]

# Remove the square brackets and split the string by commas
split_str = val[0][1:-1].split(',')

# Create a list from the split strings
my_list = [item.strip("'") for item in split_str]

print(my_list)