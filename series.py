#!/usr/bin/python
import os
import sys
import re
from collections import defaultdict

source = r'N:\Unsorted'
dest = r'N:\Unsorted\sorted'
source = r'\\dkvm\vgoissa\rtorrent\download\HS'

source = r'Z:\HS'
source = len(sys.argv)>1 and sys.argv[1] or '.' # get src path from CLI or work in local dir
dest = len(sys.argv)>2 and sys.argv[2] or '-'   # get dest path from CLI or do noting

#print source, dest
#quit()

# with open('m:\\new\\a.lst') as prefix_list:
#     for rec in csv.reader(prefix_list, delimiter='\t'):
#         prefixes.append(rec)
# print(prefixes)
# print(os.listdir(source))
groups = defaultdict(lambda : set())
series = defaultdict(lambda : [])
# for dname in os.listdir(dest):
#     if os.path.isdir(dest + '\\' + dname):
#         groups.add(dname)
# print groups
seriesfilter = re.compile(r'^\[([^]]+)\] ([^[\]]+) - ([0-9][0-9v\.]*[0-9])( \[[^\]]+\])?\.(\w+)$')
for rname, rematch in [(fname, seriesfilter.match(fname)) for fname in os.listdir(source)]:
    if rematch:
        serie = rematch.group(2)
        group = rematch.group(1)
        episode = rematch.group(3)
        gpath = dest + '\\' + group + '\\' + serie + '\\'
        spath = source + '\\'
        groups[group].add(serie)
        series[serie].append(episode)
        if not dest == '-':
            print "Moving: ", rname, gpath
            os.renames(spath + rname, gpath + rname)
        else:
            print "No action: ", rname, gpath, rematch.groups()
    else:
        print "No match: ", rname

def isint(x):
    return(isinstance(x,int))

def aprint(d):
    for k in d:
        print '%s:\n    %s' % (k,sorted(d[k]))
def dprint(d):
    for k in d:
        miss = missed(d[k])
        print '%s:\n    %s' % (k,sorted(d[k]))
        if miss:
            print ' -  %s' % miss

def epnum(s):
  try:
    if 'v' in s:
        return int(s[:s.find('v')])
    elif '.' in s:
        return float(s)
    else:
        return int(s)
  except ValueError:
      print 'error with ',s
      # raise
def missed(l):
    res = []
    ll = filter(isint,map(epnum,l))
    if ll:
        # ls = reduce(min,ll)
        le = reduce(max,ll)
        if le:
            for ep in xrange(1,le):
                if not ep in ll:
                    res.append('%02d'%ep)
    return res

aprint (groups)
dprint (series)
