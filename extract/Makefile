# Copyright (c) 2012 The Native Client Authors. All rights reserved.
# Use of this source code is governed by a BSD-style license that can be
# found in the LICENSE file.

#
# GNU Make based build file.  For details on GNU Make see:
#   http://www.gnu.org/software/make/manual/make.html
#

#
# Get pepper directory for toolchain and includes.
#
# If NACL_SDK_ROOT is not set, then assume it can be found a two directories up,
# from the default example directory location.
#
THIS_MAKEFILE:=$(abspath $(lastword $(MAKEFILE_LIST)))
#NACL_SDK_ROOT?=$(abspath $(dir $(THIS_MAKEFILE))../..)
NACL_SDK_ROOT?=$(abspath /nacl_sdk/pepper_22)
CHROME_PATH?=Undefined

#
# Defaults
#
NACL_WARNINGS:=-Wno-long-long -Wall -Wswitch-enum -Werror

#
# Project Settings
#
VALID_TOOLCHAINS:=newlib glibc win
TOOLCHAIN?=newlib



#
# Default target
#
all:

#
# Alias for standard commands
#
CP:=python $(NACL_SDK_ROOT)/tools/oshelpers.py cp
MKDIR:=python $(NACL_SDK_ROOT)/tools/oshelpers.py mkdir
MV:=python $(NACL_SDK_ROOT)/tools/oshelpers.py mv
RM:=python $(NACL_SDK_ROOT)/tools/oshelpers.py rm


#
# Verify we selected a valid toolchain for this example
#
ifeq (,$(findstring $(TOOLCHAIN),$(VALID_TOOLCHAINS)))
$(warning Availbile choices are: $(VALID_TOOLCHAINS))
$(error Can not use TOOLCHAIN=$(TOOLCHAIN) on this example.)
endif


#
# Compute path to requested NaCl Toolchain
#
OSNAME:=$(shell python $(NACL_SDK_ROOT)/tools/getos.py)
TC_PATH:=$(abspath $(NACL_SDK_ROOT)/toolchain)


#
# Verify we have a valid NACL_SDK_ROOT by looking for the toolchain directory
#
ifeq (,$(wildcard $(TC_PATH)))
$(warning No valid NACL_SDK_ROOT at $(NACL_SDK_ROOT))
ifeq ($(origin NACL_SDK_ROOT), 'file')
$(error Override the default value via enviornment variable, or command-line.)
else
$(error Fix the NACL_SDK_ROOT specified in the environment or command-line.)
endif
endif


#
# Disable DOS PATH warning when using Cygwin based NaCl tools on Windows
#
CYGWIN ?= nodosfilewarning
export CYGWIN


#
# Defaults for TOOLS
#

NEWLIB_CC?=$(TC_PATH)/$(OSNAME)_x86_newlib/bin/i686-nacl-gcc -c
NEWLIB_CXX?=$(TC_PATH)/$(OSNAME)_x86_newlib/bin/i686-nacl-g++ -c -std=gnu++98
NEWLIB_LINK?=$(TC_PATH)/$(OSNAME)_x86_newlib/bin/i686-nacl-g++ -Wl,-as-needed
NEWLIB_LIB?=$(TC_PATH)/$(OSNAME)_x86_newlib/bin/i686-nacl-ar r
NEWLIB_DUMP?=$(TC_PATH)/$(OSNAME)_x86_newlib/x86_64-nacl/bin/objdump
NEWLIB_CCFLAGS?=-MMD -pthread $(NACL_WARNINGS) -idirafter $(NACL_SDK_ROOT)/include
NEWLIB_LDFLAGS?=-pthread

GLIBC_CC?=$(TC_PATH)/$(OSNAME)_x86_glibc/bin/i686-nacl-gcc -c
GLIBC_CXX?=$(TC_PATH)/$(OSNAME)_x86_glibc/bin/i686-nacl-g++ -c -std=gnu++98
GLIBC_LINK?=$(TC_PATH)/$(OSNAME)_x86_glibc/bin/i686-nacl-g++ -Wl,-as-needed
GLIBC_LIB?=$(TC_PATH)/$(OSNAME)_x86_glibc/bin/i686-nacl-ar r
GLIBC_DUMP?=$(TC_PATH)/$(OSNAME)_x86_glibc/x86_64-nacl/bin/objdump
GLIBC_PATHS:=-L $(TC_PATH)/$(OSNAME)_x86_glibc/x86_64-nacl/lib32
GLIBC_PATHS+=-L $(TC_PATH)/$(OSNAME)_x86_glibc/x86_64-nacl/lib
GLIBC_CCFLAGS?=-MMD -pthread $(NACL_WARNINGS) -idirafter $(NACL_SDK_ROOT)/include
GLIBC_LDFLAGS?=-pthread

WIN_CC?=cl.exe /nologo
WIN_CXX?=cl.exe /nologo
WIN_LINK?=link.exe /nologo
WIN_LIB?=lib.exe /nologo
WIN_CCFLAGS=/I$(NACL_SDK_ROOT)/include /I$(NACL_SDK_ROOT)/include/win -D WIN32 -D _WIN32



#
# NMF Manifiest generation
#
# Use the python script create_nmf to scan the binaries for dependencies using
# objdump.  Pass in the (-L) paths to the default library toolchains so that we
# can find those libraries and have it automatically copy the files (-s) to
# the target directory for us.
NMF:=python $(NACL_SDK_ROOT)/tools/create_nmf.py


#
# Verify we can find the Chrome executable if we need to launch it.
#
.PHONY: CHECK_FOR_CHROME
CHECK_FOR_CHROME:
ifeq (,$(wildcard $(CHROME_PATH)))
	$(warning No valid Chrome found at CHROME_PATH=$(CHROME_PATH))
	$(error Set CHROME_PATH via an environment variable, or command-line.)
else
	$(warning Using chrome at: $(CHROME_PATH))
endif

#
# Per target object lists
#
HELLO_WORLD_INTERACTIVE_OBJS:=hello_world helper_functions

#
# Rules for newlib toolchain
#
newlib:
	$(MKDIR) newlib
newlib/Debug: | newlib
	$(MKDIR) newlib/Debug
newlib/Release: | newlib
	$(MKDIR) newlib/Release

# Include header dependency files.
-include newlib/Debug/*.d
-include newlib/Release/*.d

newlib/Debug/hello_world_x86_32.o : hello_world.cc $(THIS_MAKE) | newlib/Debug
	$(NEWLIB_CC) -o $@ $< -g -O0 -m32 $(HELLO_WORLD_INTERACTIVE_CXXFLAGS) -DTCNAME=newlib $(NEWLIB_CCFLAGS)  

newlib/Debug/helper_functions_x86_32.o : helper_functions.cc $(THIS_MAKE) | newlib/Debug
	$(NEWLIB_CC) -o $@ $< -g -O0 -m32 $(HELLO_WORLD_INTERACTIVE_CXXFLAGS) -DTCNAME=newlib $(NEWLIB_CCFLAGS)  


HELLO_WORLD_INTERACTIVE_NEWLIB_DEBUG_x86_32_O:=$(patsubst %,newlib/Debug/%_x86_32.o,$(HELLO_WORLD_INTERACTIVE_OBJS))
newlib/Debug/hello_world_interactive_x86_32.nexe : $(HELLO_WORLD_INTERACTIVE_NEWLIB_DEBUG_x86_32_O)
	$(NEWLIB_LINK) -o $@ $^ -g -m32 $(HELLO_WORLD_INTERACTIVE_LDFLAGS) $(NEWLIB_LDFLAGS) -lppapi_cpp -lppapi -lpthread

newlib/Debug/hello_world_x86_64.o : hello_world.cc $(THIS_MAKE) | newlib/Debug
	$(NEWLIB_CC) -o $@ $< -g -O0 -m64 $(HELLO_WORLD_INTERACTIVE_CXXFLAGS) -DTCNAME=newlib $(NEWLIB_CCFLAGS)  

newlib/Debug/helper_functions_x86_64.o : helper_functions.cc $(THIS_MAKE) | newlib/Debug
	$(NEWLIB_CC) -o $@ $< -g -O0 -m64 $(HELLO_WORLD_INTERACTIVE_CXXFLAGS) -DTCNAME=newlib $(NEWLIB_CCFLAGS)  


HELLO_WORLD_INTERACTIVE_NEWLIB_DEBUG_x86_64_O:=$(patsubst %,newlib/Debug/%_x86_64.o,$(HELLO_WORLD_INTERACTIVE_OBJS))
newlib/Debug/hello_world_interactive_x86_64.nexe : $(HELLO_WORLD_INTERACTIVE_NEWLIB_DEBUG_x86_64_O)
	$(NEWLIB_LINK) -o $@ $^ -g -m64 $(HELLO_WORLD_INTERACTIVE_LDFLAGS) $(NEWLIB_LDFLAGS) -lppapi_cpp -lppapi -lpthread


ALL_TARGETS+=newlib/Debug/hello_world_interactive.nmf
newlib/Debug/hello_world_interactive.nmf : newlib/Debug/hello_world_interactive_x86_32.nexe newlib/Debug/hello_world_interactive_x86_64.nexe
	$(NMF) -D $(NEWLIB_DUMP) -o $@ $^ -t newlib -s newlib/Debug

newlib/Release/hello_world_x86_32.o : hello_world.cc $(THIS_MAKE) | newlib/Release
	$(NEWLIB_CC) -o $@ $< -O2 -m32 $(HELLO_WORLD_INTERACTIVE_CXXFLAGS) -DTCNAME=newlib $(NEWLIB_CCFLAGS)  

newlib/Release/helper_functions_x86_32.o : helper_functions.cc $(THIS_MAKE) | newlib/Release
	$(NEWLIB_CC) -o $@ $< -O2 -m32 $(HELLO_WORLD_INTERACTIVE_CXXFLAGS) -DTCNAME=newlib $(NEWLIB_CCFLAGS)  


HELLO_WORLD_INTERACTIVE_NEWLIB_RELEASE_x86_32_O:=$(patsubst %,newlib/Release/%_x86_32.o,$(HELLO_WORLD_INTERACTIVE_OBJS))
newlib/Release/hello_world_interactive_x86_32.nexe : $(HELLO_WORLD_INTERACTIVE_NEWLIB_RELEASE_x86_32_O)
	$(NEWLIB_LINK) -o $@ $^ -m32 $(HELLO_WORLD_INTERACTIVE_LDFLAGS) $(NEWLIB_LDFLAGS) -lppapi_cpp -lppapi -lpthread

newlib/Release/hello_world_x86_64.o : hello_world.cc $(THIS_MAKE) | newlib/Release
	$(NEWLIB_CC) -o $@ $< -O2 -m64 $(HELLO_WORLD_INTERACTIVE_CXXFLAGS) -DTCNAME=newlib $(NEWLIB_CCFLAGS)  

newlib/Release/helper_functions_x86_64.o : helper_functions.cc $(THIS_MAKE) | newlib/Release
	$(NEWLIB_CC) -o $@ $< -O2 -m64 $(HELLO_WORLD_INTERACTIVE_CXXFLAGS) -DTCNAME=newlib $(NEWLIB_CCFLAGS)  


HELLO_WORLD_INTERACTIVE_NEWLIB_RELEASE_x86_64_O:=$(patsubst %,newlib/Release/%_x86_64.o,$(HELLO_WORLD_INTERACTIVE_OBJS))
newlib/Release/hello_world_interactive_x86_64.nexe : $(HELLO_WORLD_INTERACTIVE_NEWLIB_RELEASE_x86_64_O)
	$(NEWLIB_LINK) -o $@ $^ -m64 $(HELLO_WORLD_INTERACTIVE_LDFLAGS) $(NEWLIB_LDFLAGS) -lppapi_cpp -lppapi -lpthread


ALL_TARGETS+=newlib/Release/hello_world_interactive.nmf
newlib/Release/hello_world_interactive.nmf : newlib/Release/hello_world_interactive_x86_32.nexe newlib/Release/hello_world_interactive_x86_64.nexe
	$(NMF) -D $(NEWLIB_DUMP) -o $@ $^ -t newlib -s newlib/Release


#
# Rules for glibc toolchain
#
glibc:
	$(MKDIR) glibc
glibc/Debug: | glibc
	$(MKDIR) glibc/Debug
glibc/Release: | glibc
	$(MKDIR) glibc/Release

# Include header dependency files.
-include glibc/Debug/*.d
-include glibc/Release/*.d

glibc/Debug/hello_world_x86_32.o : hello_world.cc $(THIS_MAKE) | glibc/Debug
	$(GLIBC_CC) -o $@ $< -g -O0 -m32 $(HELLO_WORLD_INTERACTIVE_CXXFLAGS) -DTCNAME=glibc $(GLIBC_CCFLAGS)  

glibc/Debug/helper_functions_x86_32.o : helper_functions.cc $(THIS_MAKE) | glibc/Debug
	$(GLIBC_CC) -o $@ $< -g -O0 -m32 $(HELLO_WORLD_INTERACTIVE_CXXFLAGS) -DTCNAME=glibc $(GLIBC_CCFLAGS)  


HELLO_WORLD_INTERACTIVE_GLIBC_DEBUG_x86_32_O:=$(patsubst %,glibc/Debug/%_x86_32.o,$(HELLO_WORLD_INTERACTIVE_OBJS))
glibc/Debug/hello_world_interactive_x86_32.nexe : $(HELLO_WORLD_INTERACTIVE_GLIBC_DEBUG_x86_32_O)
	$(GLIBC_LINK) -o $@ $^ -g -m32 $(HELLO_WORLD_INTERACTIVE_LDFLAGS) $(GLIBC_LDFLAGS) -lppapi_cpp -lppapi -lpthread

glibc/Debug/hello_world_x86_64.o : hello_world.cc $(THIS_MAKE) | glibc/Debug
	$(GLIBC_CC) -o $@ $< -g -O0 -m64 $(HELLO_WORLD_INTERACTIVE_CXXFLAGS) -DTCNAME=glibc $(GLIBC_CCFLAGS)  

glibc/Debug/helper_functions_x86_64.o : helper_functions.cc $(THIS_MAKE) | glibc/Debug
	$(GLIBC_CC) -o $@ $< -g -O0 -m64 $(HELLO_WORLD_INTERACTIVE_CXXFLAGS) -DTCNAME=glibc $(GLIBC_CCFLAGS)  


HELLO_WORLD_INTERACTIVE_GLIBC_DEBUG_x86_64_O:=$(patsubst %,glibc/Debug/%_x86_64.o,$(HELLO_WORLD_INTERACTIVE_OBJS))
glibc/Debug/hello_world_interactive_x86_64.nexe : $(HELLO_WORLD_INTERACTIVE_GLIBC_DEBUG_x86_64_O)
	$(GLIBC_LINK) -o $@ $^ -g -m64 $(HELLO_WORLD_INTERACTIVE_LDFLAGS) $(GLIBC_LDFLAGS) -lppapi_cpp -lppapi -lpthread


ALL_TARGETS+=glibc/Debug/hello_world_interactive.nmf
glibc/Debug/hello_world_interactive.nmf : glibc/Debug/hello_world_interactive_x86_32.nexe glibc/Debug/hello_world_interactive_x86_64.nexe
	$(NMF) -D $(GLIBC_DUMP) -o $@ $(GLIBC_PATHS) $^ -t glibc -s glibc/Debug $(GLIBC_REMAP)

glibc/Release/hello_world_x86_32.o : hello_world.cc $(THIS_MAKE) | glibc/Release
	$(GLIBC_CC) -o $@ $< -O2 -m32 $(HELLO_WORLD_INTERACTIVE_CXXFLAGS) -DTCNAME=glibc $(GLIBC_CCFLAGS)  

glibc/Release/helper_functions_x86_32.o : helper_functions.cc $(THIS_MAKE) | glibc/Release
	$(GLIBC_CC) -o $@ $< -O2 -m32 $(HELLO_WORLD_INTERACTIVE_CXXFLAGS) -DTCNAME=glibc $(GLIBC_CCFLAGS)  


HELLO_WORLD_INTERACTIVE_GLIBC_RELEASE_x86_32_O:=$(patsubst %,glibc/Release/%_x86_32.o,$(HELLO_WORLD_INTERACTIVE_OBJS))
glibc/Release/hello_world_interactive_x86_32.nexe : $(HELLO_WORLD_INTERACTIVE_GLIBC_RELEASE_x86_32_O)
	$(GLIBC_LINK) -o $@ $^ -m32 $(HELLO_WORLD_INTERACTIVE_LDFLAGS) $(GLIBC_LDFLAGS) -lppapi_cpp -lppapi -lpthread

glibc/Release/hello_world_x86_64.o : hello_world.cc $(THIS_MAKE) | glibc/Release
	$(GLIBC_CC) -o $@ $< -O2 -m64 $(HELLO_WORLD_INTERACTIVE_CXXFLAGS) -DTCNAME=glibc $(GLIBC_CCFLAGS)  

glibc/Release/helper_functions_x86_64.o : helper_functions.cc $(THIS_MAKE) | glibc/Release
	$(GLIBC_CC) -o $@ $< -O2 -m64 $(HELLO_WORLD_INTERACTIVE_CXXFLAGS) -DTCNAME=glibc $(GLIBC_CCFLAGS)  


HELLO_WORLD_INTERACTIVE_GLIBC_RELEASE_x86_64_O:=$(patsubst %,glibc/Release/%_x86_64.o,$(HELLO_WORLD_INTERACTIVE_OBJS))
glibc/Release/hello_world_interactive_x86_64.nexe : $(HELLO_WORLD_INTERACTIVE_GLIBC_RELEASE_x86_64_O)
	$(GLIBC_LINK) -o $@ $^ -m64 $(HELLO_WORLD_INTERACTIVE_LDFLAGS) $(GLIBC_LDFLAGS) -lppapi_cpp -lppapi -lpthread


ALL_TARGETS+=glibc/Release/hello_world_interactive.nmf
glibc/Release/hello_world_interactive.nmf : glibc/Release/hello_world_interactive_x86_32.nexe glibc/Release/hello_world_interactive_x86_64.nexe
	$(NMF) -D $(GLIBC_DUMP) -o $@ $(GLIBC_PATHS) $^ -t glibc -s glibc/Release $(GLIBC_REMAP)


#
# Rules for win toolchain
#
win:
	$(MKDIR) win
win/Debug: | win
	$(MKDIR) win/Debug
win/Release: | win
	$(MKDIR) win/Release

# Include header dependency files.
-include win/Debug/*.d
-include win/Release/*.d

win/Debug/hello_world_x86_32.o : hello_world.cc $(THIS_MAKE) | win/Debug
	$(WIN_CC) /Od /Fo$@ /MTd /c $< -DTCNAME=host $(WIN_CCFLAGS)  

win/Debug/helper_functions_x86_32.o : helper_functions.cc $(THIS_MAKE) | win/Debug
	$(WIN_CC) /Od /Fo$@ /MTd /c $< -DTCNAME=host $(WIN_CCFLAGS)  


HELLO_WORLD_INTERACTIVE_WIN_DEBUG_x86_32_O:=$(patsubst %,win/Debug/%_x86_32.o,$(HELLO_WORLD_INTERACTIVE_OBJS))
win/Debug/hello_world_interactive.dll : $(HELLO_WORLD_INTERACTIVE_WIN_DEBUG_x86_32_O)
	$(WIN_LINK) /DLL /OUT:$@ $(HELLO_WORLD_INTERACTIVE_LDFLAGS) /LIBPATH:$(NACL_SDK_ROOT)/lib/win_x86_32_host/Debug $^ ppapi_cpp.lib ppapi.lib pthread.lib $(WIN_LDFLAGS)


ALL_TARGETS+=win/Debug/hello_world_interactive.nmf
win/Debug/hello_world_interactive.nmf : win/Debug/hello_world_interactive.dll | win/Debug
	echo {} > $@

win/Release/hello_world_x86_32.o : hello_world.cc $(THIS_MAKE) | win/Release
	$(WIN_CC) /O2 /Fo$@ /MT /c $< -DTCNAME=host $(WIN_CCFLAGS)  

win/Release/helper_functions_x86_32.o : helper_functions.cc $(THIS_MAKE) | win/Release
	$(WIN_CC) /O2 /Fo$@ /MT /c $< -DTCNAME=host $(WIN_CCFLAGS)  


HELLO_WORLD_INTERACTIVE_WIN_RELEASE_x86_32_O:=$(patsubst %,win/Release/%_x86_32.o,$(HELLO_WORLD_INTERACTIVE_OBJS))
win/Release/hello_world_interactive.dll : $(HELLO_WORLD_INTERACTIVE_WIN_RELEASE_x86_32_O)
	$(WIN_LINK) /DLL /OUT:$@ $(HELLO_WORLD_INTERACTIVE_LDFLAGS) /LIBPATH:$(NACL_SDK_ROOT)/lib/win_x86_32_host/Release $^ ppapi_cpp.lib ppapi.lib pthread.lib $(WIN_LDFLAGS)


ALL_TARGETS+=win/Release/hello_world_interactive.nmf
win/Release/hello_world_interactive.nmf : win/Release/hello_world_interactive.dll | win/Release
	echo {} > $@

#
# Target to remove temporary files
#
.PHONY: clean
clean:
	$(RM) -fr newlib/Debug
	$(RM) -fr newlib/Release
	$(RM) -fr glibc/Debug
	$(RM) -fr glibc/Release
	$(RM) -fr win/Debug
	$(RM) -fr win/Release


all: $(ALL_TARGETS)




RUN: all
	python ../httpd.py

LAUNCH_NEXE: CHECK_FOR_CHROME all
	$(CHROME_PATH) $(NEXE_ARGS) "localhost:5103/index.html"


